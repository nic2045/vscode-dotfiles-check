# Install vscode-dotfiles-check extension locally (Windows)
# Requires Developer Mode enabled for symlink creation without admin rights

$ErrorActionPreference = 'Stop'

$ExtensionDir = $PSScriptRoot
$PackageJson = Get-Content "$ExtensionDir\package.json" -Raw | ConvertFrom-Json
$Version = $PackageJson.version

if (-not $Version) {
    Write-Error "Could not read version from package.json"
    exit 1
}

$VSCodeExtensionsDir = "$env:USERPROFILE\.vscode\extensions"
New-Item -ItemType Directory -Force -Path $VSCodeExtensionsDir | Out-Null

$LinkTarget = "$VSCodeExtensionsDir\nico.dotfiles-check-$Version"

if (Test-Path $LinkTarget) {
    Write-Host "$LinkTarget already exists"
    $reply = Read-Host "Overwrite? (y/n)"
    if ($reply -notmatch '^[Yy]$') {
        Write-Host "Skipped"
        exit 0
    }
    Remove-Item -Recurse -Force $LinkTarget
}

New-Item -ItemType SymbolicLink -Path $LinkTarget -Target $ExtensionDir | Out-Null
Write-Host "Extension installed (v$Version)"
Write-Host ""
Write-Host "Restart VSCode to activate the extension."
