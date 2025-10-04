# Quick Google Sheets Export Test

Write-Host "" # Empty line
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 Google Sheets Export Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "" # Empty line

# Check backend
Write-Host "Checking backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 2
    Write-Host "✅ Backend is running" -ForegroundColor Green
    Write-Host "" # Empty line
} catch {
    Write-Host "❌ Backend not running! Start it first:" -ForegroundColor Red
    Write-Host "   cd backend" -ForegroundColor Yellow
    Write-Host "   node src/server.js" -ForegroundColor Yellow
    Write-Host "" # Empty line
    exit 1
}

# Login
Write-Host "Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "harish@test.com"
    password = "Loki@2403"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "✅ Logged in as: $($login.data.user.name)" -ForegroundColor Green
    Write-Host "" # Empty line
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "" # Empty line
    exit 1
}

# Export to Google Sheets
Write-Host "📤 Exporting to Google Sheets 'Registrations'..." -ForegroundColor Yellow
$headers = @{"Authorization" = "Bearer $token"}
$exportBody = @{
    dataType = "registrations"
    filters = @{}
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/google-sheets" -Method Post -Headers $headers -ContentType "application/json" -Body $exportBody
    
    Write-Host "" # Empty line
    Write-Host "✅ SUCCESS! Data exported to Google Sheets!" -ForegroundColor Green
    Write-Host "" # Empty line
    Write-Host "📊 Sheet Name: Registrations" -ForegroundColor Cyan
    Write-Host "🔗 URL: $($result.data.sheetUrl)" -ForegroundColor White
    Write-Host "" # Empty line
    
    Write-Host "🌐 Opening in browser..." -ForegroundColor Yellow
    Start-Process $result.data.sheetUrl
    
    Write-Host "" # Empty line
    Write-Host "✅ Test complete! Check your browser." -ForegroundColor Green
    Write-Host "" # Empty line
    
} catch {
    Write-Host "" # Empty line
    Write-Host "❌ Export failed!" -ForegroundColor Red
    Write-Host "" # Empty line
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        try {
            $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "" # Empty line
            Write-Host "Details: $($errorObj.message)" -ForegroundColor Yellow
        } catch {
            Write-Host "" # Empty line
            Write-Host "Raw error: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "" # Empty line
    Write-Host "🔍 Troubleshooting:" -ForegroundColor Cyan
    Write-Host "1. Did you share your Google Sheet with the service account email?" -ForegroundColor Gray
    Write-Host "   Email: shackles-sheets-exporter@shackles-symposium.iam.gserviceaccount.com" -ForegroundColor Gray
    Write-Host "2. Is the GOOGLE_SHEET_ID correct in .env?" -ForegroundColor Gray
    Write-Host "3. Is the GOOGLE_PRIVATE_KEY properly formatted?" -ForegroundColor Gray
    Write-Host "4. Did you restart the backend after changing .env?" -ForegroundColor Gray
    Write-Host "" # Empty line for spacing
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "" # Empty line for spacing
