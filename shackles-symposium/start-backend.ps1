# ==========================================
# START BACKEND - SHACKLES 2025
# ==========================================
# Double-click this file or run: .\start-backend.ps1

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 STARTING SHACKLES 2025 BACKEND SERVER" -ForegroundColor Green
Write-Host "  Department of Mechanical Engineering, ACGCET" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
Set-Location $backendPath

Write-Host "📁 Location: $backendPath`n" -ForegroundColor Yellow

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Red
    Write-Host "   Please create .env file from .env.example" -ForegroundColor Yellow
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

# Start the backend server
Write-Host "🎯 Starting backend in development mode...`n" -ForegroundColor Green
Write-Host "   Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server`n" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

npm run dev
