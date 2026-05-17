const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

let outputChannel;
let statusBar;
let syncInterval;

// Only run dotfiles checks for repos owned by this GitHub user / org.
const ALLOWED_GIT_OWNERS = ['nic2045'];

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  outputChannel.appendLine(`[${timestamp}] ${msg}`);
}

function git(args, cwd) {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout.trim());
    });
  });
}

async function getDotfilesPath() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return null;
  const projectDir = workspaceFolder.uri.fsPath;
  const parentDir = path.dirname(projectDir);
  return path.join(parentDir, 'dotfiles');
}

// Returns { isRepo, isRoot, owner, remoteUrl } for the given directory.
async function inspectGitRepo(projectDir) {
  let toplevel;
  try {
    toplevel = await git(['rev-parse', '--show-toplevel'], projectDir);
  } catch {
    return { isRepo: false };
  }

  const isRoot = path.resolve(toplevel) === path.resolve(projectDir);

  let remoteUrl = '';
  try {
    remoteUrl = await git(['config', '--get', 'remote.origin.url'], projectDir);
  } catch {
    // no remote configured
  }

  const owner = parseGitOwner(remoteUrl);
  return { isRepo: true, isRoot, owner, remoteUrl };
}

// Extract the owner/org from common git remote formats:
//   https://github.com/<owner>/<repo>(.git)
//   git@github.com:<owner>/<repo>(.git)
//   ssh://git@github.com/<owner>/<repo>(.git)
function parseGitOwner(url) {
  if (!url) return null;
  const patterns = [
    /^https?:\/\/[^/]+\/([^/]+)\/[^/]+?(?:\.git)?\/?$/i,
    /^git@[^:]+:([^/]+)\/[^/]+?(?:\.git)?\/?$/i,
    /^ssh:\/\/[^/]+\/([^/]+)\/[^/]+?(?:\.git)?\/?$/i,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function checkClaudeMd(projectDir, dotfilesPath) {
  const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
  const projectName = path.basename(projectDir);
  const expectedTarget = path.join(dotfilesPath, 'claude', 'projects', `${projectName}.md`);

  let stat;
  try {
    stat = fs.lstatSync(claudeMdPath);
  } catch (e) {
    return { ok: false, issue: 'CLAUDE.md missing', claudeMdPath, expectedTarget };
  }

  if (!stat.isSymbolicLink()) {
    return { ok: false, issue: 'CLAUDE.md exists but is not a symlink', claudeMdPath, expectedTarget };
  }

  if (!fs.existsSync(claudeMdPath)) {
    return { ok: false, issue: 'CLAUDE.md is a broken symlink', claudeMdPath, expectedTarget };
  }

  let resolvedTarget;
  try {
    resolvedTarget = fs.realpathSync(claudeMdPath);
  } catch (e) {
    return { ok: false, issue: 'CLAUDE.md is a broken symlink', claudeMdPath, expectedTarget };
  }

  if (resolvedTarget !== expectedTarget) {
    return { ok: false, issue: 'CLAUDE.md symlink points to wrong target', claudeMdPath, expectedTarget };
  }

  return { ok: true };
}

async function syncDotfiles() {
  const dotfilesPath = await getDotfilesPath();
  if (!dotfilesPath || !fs.existsSync(dotfilesPath)) {
    log('Dotfiles not found');
    updateStatusBar('Dotfiles not found', 'notFound');
    return;
  }

  try {
    updateStatusBar('Syncing...', 'syncing');
    log('Starting sync...');

    // Stash local changes if any
    const status = await git(['status', '--porcelain'], dotfilesPath);
    if (status) {
      log('Stashing local changes...');
      await git(['stash'], dotfilesPath);
    }

    // Fetch and check for updates
    await git(['fetch', 'origin', 'main'], dotfilesPath);
    const diff = await git(['diff', 'HEAD', 'origin/main', '--name-only'], dotfilesPath);

    if (diff) {
      log('Updates available, pulling...');
      await git(['pull', 'origin', 'main'], dotfilesPath);
      updateStatusBar('Synced', 'synced');
      log('Dotfiles synced');
      vscode.window.showInformationMessage('Dotfiles synced');
    } else {
      log('Already up to date');
      updateStatusBar('Up to date', 'synced');
    }
  } catch (err) {
    log(`Sync failed: ${err.message}`);
    updateStatusBar('Sync failed', 'error');
    vscode.window.showErrorMessage(`Dotfiles sync failed: ${err.message}`);
  }
}

function updateStatusBar(text, state) {
  const icons = {
    synced:   '$(pass)',
    error:    '$(error)',
    syncing:  '$(sync~spin)',
    notFound: '$(circle-slash)',
    skipped:  '$(circle-slash)',
  };
  statusBar.text = `${icons[state] || '$(circle-slash)'} Dotfiles`;
  statusBar.tooltip = `Dotfiles: ${text}`;

  if (state === 'error') {
    statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    statusBar.color = new vscode.ThemeColor('statusBarItem.errorForeground');
  } else if (state === 'notFound') {
    statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBar.color = new vscode.ThemeColor('statusBarItem.warningForeground');
  } else {
    statusBar.backgroundColor = undefined;
    statusBar.color = undefined;
  }
}

function activate(context) {
  outputChannel = vscode.window.createOutputChannel('Dotfiles Check');
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.command = 'dotfiles-check.verify';
  statusBar.show();

  const verifyCmd = vscode.commands.registerCommand('dotfiles-check.verify', async () => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    const projectDir = workspaceFolder?.uri.fsPath;

    if (!projectDir) {
      log('No workspace open — skipping');
      updateStatusBar('No workspace', 'skipped');
      statusBar.hide();
      return;
    }

    // Gate: only act on git repos owned by an allowed owner, and only at the
    // repo root. This prevents creating CLAUDE.md symlinks in arbitrary folders
    // (e.g. random scratch dirs or third-party repos).
    const repoInfo = await inspectGitRepo(projectDir);

    if (!repoInfo.isRepo) {
      log(`Skipping ${projectDir}: not a git repository`);
      updateStatusBar('Not a git repo', 'skipped');
      statusBar.hide();
      return;
    }

    if (!repoInfo.isRoot) {
      log(`Skipping ${projectDir}: not the git root`);
      updateStatusBar('Not git root', 'skipped');
      statusBar.hide();
      return;
    }

    if (!repoInfo.owner || !ALLOWED_GIT_OWNERS.includes(repoInfo.owner)) {
      log(`Skipping ${projectDir}: remote '${repoInfo.remoteUrl || '<none>'}' is not from an allowed owner (${ALLOWED_GIT_OWNERS.join(', ')})`);
      updateStatusBar('External repo — skipped', 'skipped');
      statusBar.hide();
      return;
    }

    // From here on we know it's one of the user's own repos at its root.
    statusBar.show();

    const dotfilesPath = await getDotfilesPath();
    if (!dotfilesPath || !fs.existsSync(dotfilesPath)) {
      const action = await vscode.window.showWarningMessage(
        'Dotfiles not found',
        { modal: true, detail: `Expected at: ${dotfilesPath}\n\nRun setup to initialize dotfiles.` },
        'Setup',
        'Skip'
      );
      if (action === 'Setup') {
        const terminal = vscode.window.createTerminal('Setup Dotfiles');
        const parentDir = dotfilesPath ? path.dirname(dotfilesPath) : '~';
        terminal.sendText(`cd "${parentDir}" && git clone https://github.com/nic2045/dotfiles.git && cd dotfiles && bash setup.sh`);
        terminal.show();
      }
      return;
    }

    const claudeCheck = checkClaudeMd(projectDir, dotfilesPath);
    if (!claudeCheck.ok) {
      const projectName = path.basename(projectDir);
      log(`CLAUDE.md issue: ${claudeCheck.issue}`);
      updateStatusBar('CLAUDE.md missing', 'notFound');
      const action = await vscode.window.showWarningMessage(
        `Project "${projectName}" is missing a valid CLAUDE.md`,
        {
          modal: false,
          detail: `${claudeCheck.issue}\n\nExpected: CLAUDE.md → dotfiles/claude/projects/${projectName}.md`,
        },
        'Fix',
        'Ignore'
      );
      if (action === 'Fix') {
        try {
          const targetDir = path.dirname(claudeCheck.expectedTarget);
          if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
          if (!fs.existsSync(claudeCheck.expectedTarget)) {
            fs.writeFileSync(
              claudeCheck.expectedTarget,
              `# ${projectName} — Claude Instructions\n\n@../CLAUDE.md\n\n<!-- Add project-specific instructions here -->\n`
            );
          }
          try { fs.unlinkSync(claudeCheck.claudeMdPath); } catch {}
          fs.symlinkSync(`../dotfiles/claude/projects/${projectName}.md`, claudeCheck.claudeMdPath);
          log(`CLAUDE.md symlink created for ${projectName}`);
          const reload = await vscode.window.showInformationMessage(
            `✓ CLAUDE.md set up for "${projectName}". Reload window so Claude reads it?`,
            'Reload Window',
            'Later'
          );
          if (reload === 'Reload Window') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          } else {
            vscode.commands.executeCommand('dotfiles-check.verify');
          }
        } catch (err) {
          log(`Fix failed: ${err.message}`);
          vscode.window.showErrorMessage(`Fix failed: ${err.message}`);
        }
      }
      return;
    }

    log('Dotfiles verified');
    updateStatusBar('Up to date', 'synced');
  });

  const syncCmd = vscode.commands.registerCommand('dotfiles-check.sync', syncDotfiles);

  context.subscriptions.push(verifyCmd, syncCmd, statusBar, outputChannel);

  // Initial verify on startup
  vscode.commands.executeCommand('dotfiles-check.verify');

  // Background sync every 6 hours
  syncInterval = setInterval(syncDotfiles, 6 * 60 * 60 * 1000);
  log('Extension activated — background sync every 6 hours');
}

function deactivate() {
  if (syncInterval) clearInterval(syncInterval);
}

module.exports = { activate, deactivate };
