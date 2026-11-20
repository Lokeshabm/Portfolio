# PowerShell script to compile and run B M LOKESHA Java SE Backend Server
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Compiling B M LOKESHA Java SE Portfolio Backend...   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

$sources = Get-ChildItem -Recurse -Path "src\main\java" -Filter "*.java" | ForEach-Object { $_.FullName }

if ($sources.Count -eq 0) {
    Write-Host "[ERROR] No Java source files found!" -ForegroundColor Red
    exit 1
}

# Compile with Jakarta Mail library dependencies in lib/
$compileResult = javac -cp "lib/*" -d bin $sources
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[OK] Compilation completed successfully!" -ForegroundColor Green
Write-Host "Starting Java SE HTTP Server on port 8080..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to terminate the server.`n" -ForegroundColor Gray

# Run with application classes and Jakarta Mail jars
java -cp "bin;lib/*" com.lokesha.portfolio.Main
