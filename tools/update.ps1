<#
.SYNOPSIS
  Updates an Obsidian vault from this repo's vault/ folder without touching your notes.

.DESCRIPTION
  - Framework files (templates, scripts, CSS snippets, Home, README, Knowledge Base index) are REPLACED
    when they differ. The old copy is backed up first (outside the vault).
  - Starter files (Sticky, General Docs & Links, Git Activity, Commands and hotkeys) are created only if MISSING.
  - Your own notes (categories, projects, People, Daily, Weekly, Knowledge Base notes) are never touched.
  - Obsidian settings: only ADDS what's missing (new CSS snippets switched on, new template commands in
    Templater's hotkey list). Your hotkeys, theme and other settings are left alone.
  Run it on ONE computer; Google Drive carries the changes to the others.

.EXAMPLE
  .\tools\update.ps1                                   # pulls the repo, then updates G:\My Drive\ObsidianVault
  .\tools\update.ps1 -Vault "D:\Notes\ObsidianVault"   # a different vault
  .\tools\update.ps1 -WhatIf                           # only show what would change
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$Vault = "G:\My Drive\ObsidianVault",
  [switch]$NoPull
)
$ErrorActionPreference = "Stop"
$Repo = Split-Path -Parent $PSScriptRoot
$Src = Join-Path $Repo "vault"
$Utf8 = New-Object System.Text.UTF8Encoding($false)

if (-not (Test-Path (Join-Path $Vault ".obsidian"))) { throw "$Vault doesn't look like an Obsidian vault (no .obsidian folder)." }

if (-not $NoPull) {
  Write-Host "Pulling the latest version..." -ForegroundColor Cyan
  git -C $Repo pull --ff-only
  if ($LASTEXITCODE -ne 0) { throw "git pull failed. Fix it (or use -NoPull) and run again." }
}

$Stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$Backup = Join-Path $env:LOCALAPPDATA "ObsidianNotesTemplate\backup\$Stamp"
$changed = New-Object System.Collections.Generic.List[string]

function Copy-Framework([string]$rel) {
  $from = Join-Path $Src $rel; $to = Join-Path $Vault $rel
  if (Test-Path $to) {
    if ((Get-FileHash -LiteralPath $from).Hash -eq (Get-FileHash -LiteralPath $to).Hash) { return }
    if ($PSCmdlet.ShouldProcess($rel, "Replace (backup kept)")) {
      $bk = Join-Path $Backup $rel
      New-Item -ItemType Directory -Force -Path (Split-Path $bk) | Out-Null
      Copy-Item -LiteralPath $to -Destination $bk -Force
      Copy-Item -LiteralPath $from -Destination $to -Force
    }
    $changed.Add("updated  $rel")
  } else {
    if ($PSCmdlet.ShouldProcess($rel, "Add")) {
      New-Item -ItemType Directory -Force -Path (Split-Path $to) | Out-Null
      Copy-Item -LiteralPath $from -Destination $to -Force
    }
    $changed.Add("added    $rel")
  }
}
function Copy-IfMissing([string]$rel) {
  $to = Join-Path $Vault $rel
  if (Test-Path $to) { return }
  if ($PSCmdlet.ShouldProcess($rel, "Add starter file")) {
    New-Item -ItemType Directory -Force -Path (Split-Path $to) | Out-Null
    Copy-Item -LiteralPath (Join-Path $Src $rel) -Destination $to
  }
  $changed.Add("added    $rel (starter)")
}
function Rel([string]$full) { $full.Substring($Src.Length).TrimStart('\', '/') }

# ---- framework: replaced when different ----
foreach ($dir in "_Templates", "_Scripts", ".obsidian\snippets") {
  Get-ChildItem -LiteralPath (Join-Path $Src $dir) -File -Recurse | ForEach-Object { Copy-Framework (Rel $_.FullName) }
}
foreach ($f in "00 Home.md", "README.md", "Knowledge Base\Knowledge Base.md") { Copy-Framework $f }

# ---- starter files: only if missing ----
foreach ($f in "📌 Sticky.md", "General Docs & Links.md", "Git Activity.md", "Knowledge Base\Write-ups\Commands and hotkeys.md") { Copy-IfMissing $f }
foreach ($d in "People", "Daily", "Weekly", "Knowledge Base\Runbooks", "Knowledge Base\Write-ups") {
  $p = Join-Path $Vault $d
  if (-not (Test-Path $p)) { if ($PSCmdlet.ShouldProcess($d, "Create folder")) { New-Item -ItemType Directory -Path $p | Out-Null }; $changed.Add("added    $d\") }
}

# ---- Obsidian settings: add what's missing, never remove ----
function Merge-JsonList([string]$rel, [string]$key) {
  $srcJson = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $Src $rel) | ConvertFrom-Json
  $path = Join-Path $Vault $rel
  if (-not (Test-Path $path)) {
    if ($PSCmdlet.ShouldProcess($rel, "Add")) {
      New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null
      Copy-Item -LiteralPath (Join-Path $Src $rel) -Destination $path
    }
    $changed.Add("added    $rel"); return
  }
  $raw = Get-Content -Raw -Encoding UTF8 -LiteralPath $path
  $j = if ($key) { $raw | ConvertFrom-Json } else { $null }
  $have = if ($key) { @($j.$key) } else { @($raw | ConvertFrom-Json) }
  $want = if ($key) { @($srcJson.$key) } else { @($srcJson) }
  $missing = @($want | Where-Object { $have -notcontains $_ })
  if (-not $missing.Count) { return }
  if ($PSCmdlet.ShouldProcess($rel, "Add $($missing -join ', ')")) {
    if ($key) {
      if ($j.PSObject.Properties.Name -contains $key) { $j.$key = @($have + $missing) } else { $j | Add-Member -NotePropertyName $key -NotePropertyValue @($missing) }
      $out = $j | ConvertTo-Json -Depth 20
    } else {
      $out = ConvertTo-Json -InputObject @($have + $missing) -Depth 5
    }
    [IO.File]::WriteAllText($path, $out, $Utf8)
  }
  $changed.Add("settings $rel (+ $($missing -join ', '))")
}
Merge-JsonList ".obsidian\community-plugins.json" $null
Merge-JsonList ".obsidian\appearance.json" "enabledCssSnippets"
Merge-JsonList ".obsidian\plugins\templater-obsidian\data.json" "enabled_templates_hotkeys"
if (-not (Test-Path (Join-Path $Vault ".obsidian\daily-notes.json"))) { Copy-Framework ".obsidian\daily-notes.json" }

# ---- report ----
Write-Host ""
if ($changed.Count) {
  Write-Host "Changes:" -ForegroundColor Green
  $changed | ForEach-Object { Write-Host "  $_" }
  if (Test-Path $Backup) { Write-Host "`nReplaced files were backed up to $Backup" -ForegroundColor DarkGray }
  Write-Host "`nIn Obsidian: if templates or settings changed, run 'Reload app without saving' (Ctrl+P)."
  Write-Host "See CHANGELOG.md for anything you need to do by hand."
} else {
  Write-Host "Already up to date." -ForegroundColor Green
}
