# ==========================================
# START FRONTEND - SHACKLES 2025
# ==========================================
# Double-click this file or run: .\start-frontend.ps1

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🎨 STARTING SHACKLES 2025 FRONTEND" -ForegroundColor Green
Write-Host "  React + Vite Development Server" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Navigate to frontend directory
$frontendPath = Join-Path $PSScriptRoot "frontend"
Set-Location $frontendPath

Write-Host "📁 Location: $frontendPath`n" -ForegroundColor Yellow

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Red
    Write-Host "   Please create .env file" -ForegroundColor Yellow
    Write-Host "   See: CONNECTING_GUIDE_FOR_BEGINNERS.md`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies... (this may take a few minutes)`n" -ForegroundColor Yellow
    npm install
    Write-Host "`n"
}

# Start the frontend server
Write-Host "🎯 Starting frontend in development mode...`n" -ForegroundColor Green
Write-Host "   Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

npm run dev
