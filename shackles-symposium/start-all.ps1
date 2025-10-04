# ==========================================
# START BOTH SERVERS - SHACKLES 2025
# ==========================================
# This script starts both backend and frontend in parallel

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 STARTING SHACKLES 2025 - FULL STACK" -ForegroundColor Green
Write-Host "  Backend + Frontend Development Servers" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$projectRoot = $PSScriptRoot

# Function to start a server in a new window
function Start-ServerInNewWindow {
    param(
        [string]$Title,
        [string]$ScriptPath
    )
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $ScriptPath -WindowStyle Normal
    Write-Host "✅ $Title started in new window" -ForegroundColor Green
}

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backendScript = Join-Path $projectRoot "start-backend.ps1"
Start-ServerInNewWindow -Title "Backend" -ScriptPath $backendScript
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = Join-Path $projectRoot "start-frontend.ps1"
Start-ServerInNewWindow -Title "Frontend" -ScriptPath $frontendScript

Write-Host "`n"
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✨ BOTH SERVERS STARTED!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n  📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  📍 Frontend: http://localhost:5173`n" -ForegroundColor Cyan
Write-Host "  💡 TIP: Check the new terminal windows for server logs" -ForegroundColor Yellow
Write-Host "  🛑 To stop: Close the terminal windows or press Ctrl+C in each`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Read-Host "Press Enter to close this window"
