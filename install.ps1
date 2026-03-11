<#
SwarmWatch installer (Windows)

Usage (PowerShell):
  iwr -useb https://swarmpack.github.io/install.ps1 | iex

Notes:
- This is a thin, stable entrypoint hosted on GitHub Pages.
- It installs from the GitHub "latest release" assets.
#>

$ErrorActionPreference = "Stop"

$Repo = "SwarmPack/SwarmWatch"
$Base = "https://github.com/$Repo/releases/latest/download"

function Die($msg) {
  Write-Host ("✗ " + $msg) -ForegroundColor Red
  exit 1
}

function Info($msg) {
  Write-Host ("➜ " + $msg) -ForegroundColor Cyan
}

function Ok($msg) {
  Write-Host ("✓ " + $msg) -ForegroundColor Green
}

$arch = $env:PROCESSOR_ARCHITECTURE
if (-not $arch) { $arch = "UNKNOWN" }

# CI currently produces only Windows x64.
if ($arch -ne "AMD64") {
  Die "Unsupported Windows architecture: $arch (only x64/AMD64 supported right now)"
}

function Download-Asset($name, $dest) {
  $u = "$Base/$name"
  try {
    Invoke-WebRequest -Uri $u -OutFile $dest
    return $true
  } catch {
    return $false
  }
}

$tmp = Join-Path $env:TEMP ("swarmwatch-install-" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

try {
  $msiName = "swarmwatch-windows-x64.msi"
  $nsisName = "swarmwatch-windows-x64-setup.exe"

  Info "SwarmWatch installer"
  Info "Downloading latest release…"

  # Prefer MSI if available, else NSIS setup exe.
  $msiPath = Join-Path $tmp $msiName
  $okMsi = Download-Asset $msiName $msiPath
  if ($okMsi) {
    Ok "Downloaded MSI installer"
    Info "Launching installer…"
    Start-Process -FilePath $msiPath
    Ok "Installer started. Follow the prompts to finish installation."
    exit 0
  }

  $installerPath = Join-Path $tmp $nsisName
  $okNsis = Download-Asset $nsisName $installerPath
  if (-not $okNsis) {
    Die "Could not download Windows installer from latest release (tried $msiName and $nsisName)"
  }

  Info "Launching installer…"
  Start-Process -FilePath $installerPath
  Ok "Installer started. Follow the prompts to finish installation."
}
finally {
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}
