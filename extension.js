const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');

let outputChannel;
let statusBar;
let syncInterval;

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  outputChannel.appendLine(`[${timestamp}] ${msg}`);
}

async function getDotfilesPath() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return null;
  const projectDir = workspaceFolder.uri.fsPath;
  const parentDir = path.dirname(projectDir);
  return path.join(parentDir, 'dotfiles');
}

async function syncDotfiles() {
  const dotfilesPath = await getDotfilesPath();
  if (!dotfilesPath || !fs.existsSync(dotfilesPath)) {
    log('⚠ Dotfiles not found');
    updateStatusBar('Dotfiles not found', 'notFound');
    return;
  }

  try {
    updateStatusBar('Syncing...', 'syncing');
    log('Starting sync...');

    const git = simpleGit(dotfilesPath);

    // Stash local changes
    const status = await git.status();
    if (!status.isClean()) {
      log('Stashing local changes...');
      await git.stash();
    }

    // Fetch and pull
    await git.fetch('origin', 'main');
    const diff = await git.diff(['HEAD', 'origin/main']);

    if (diff) {
      log('Updates available, pulling...');
      await git.pull('origin', 'main');
      updateStatusBar('Synced', 'synced');
      log('✓ Dotfiles synced');
      vscode.window.showInformationMessage('✓ Dotfiles synced');
    } else {
      log('Already up to date');
      updateStatusBar('Up to date', 'synced');
    }
  } catch (err) {
    log(`✗ Sync failed: ${err.message}`);
    updateStatusBar('Sync failed', 'error');
    vscode.window.showErrorMessage(`Dotfiles sync failed: ${err.message}`);
  }
}

function updateStatusBar(text, state) {
  const colors = {
    synced: new vscode.ThemeColor('terminal.ansiGreen'),
    error: new vscode.ThemeColor('terminal.ansiRed'),
    syncing: new vscode.ThemeColor('terminal.ansiYellow'),
    notFound: new vscode.ThemeColor('terminal.ansiYellow'),
  };
  statusBar.text = `$(git-branch) ${text}`;
  statusBar.tooltip = `Dotfiles: ${text}`;
  statusBar.color = colors[state];
}

function activate(context) {
  outputChannel = vscode.window.createOutputChannel('Dotfiles Check');
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.command = 'dotfiles-check.sync';
  statusBar.show();

  // Verify on startup
  const verifyCmd = vscode.commands.registerCommand('dotfiles-check.verify', async () => {
    const dotfilesPath = await getDotfilesPath();
    if (!dotfilesPath || !fs.existsSync(dotfilesPath)) {
      const action = await vscode.window.showWarningMessage(
        '⚠️ Dotfiles not found',
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
    } else {
      log('✓ Dotfiles verified');
      updateStatusBar('Up to date', 'synced');
    }
  });

  // Manual sync command
  const syncCmd = vscode.commands.registerCommand('dotfiles-check.sync', syncDotfiles);

  context.subscriptions.push(verifyCmd, syncCmd, statusBar, outputChannel);

  // Initial verify
  vscode.commands.executeCommand('dotfiles-check.verify');

  // Schedule background sync every 6 hours
  syncInterval = setInterval(syncDotfiles, 6 * 60 * 60 * 1000);
  log('Background sync scheduled every 6 hours');
}

function deactivate() {
  if (syncInterval) clearInterval(syncInterval);
}

module.exports = { activate, deactivate };
