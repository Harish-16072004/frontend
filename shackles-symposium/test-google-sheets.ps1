# Test Google Sheets Export

Write-Host "`n📊 Testing Google Sheets Export..." -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Backend is running`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running! Start it first:`n" -ForegroundColor Red
    Write-Host "   cd backend ; node src/server.js`n" -ForegroundColor Yellow
    exit 1
}

# Login as admin
Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "harish@test.com"
    password = "Loki@2403"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "   ✅ Admin logged in: $($login.data.user.name)`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)`n" -ForegroundColor Red
    Write-Host "   Error details:" -ForegroundColor Gray
    Write-Host "   $($_.ErrorDetails.Message)`n" -ForegroundColor Gray
    exit 1
}

# Test Google Sheets Export
Write-Host "2. Exporting registrations to Google Sheets..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}
$exportBody = @{
    dataType = "registrations"
    filters = @{}
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/export/google-sheets" -Method Post -Headers $headers -ContentType "application/json" -Body $exportBody
    
    Write-Host "   ✅ Export successful!`n" -ForegroundColor Green
    Write-Host "   📊 Google Sheet URL:" -ForegroundColor Cyan
    Write-Host "   $($result.data.sheetUrl)`n" -ForegroundColor White
    Write-Host "   You can open this link in your browser to view the data.`n" -ForegroundColor Gray
    
    # Try to open in browser
    Write-Host "   Opening in browser..." -ForegroundColor Yellow
    Start-Process $result.data.sheetUrl
    
} catch {
    Write-Host "   ❌ Export failed`n" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Details: $($errorObj.message)`n" -ForegroundColor Gray
    }
    
    Write-Host "   🔍 Troubleshooting Checklist:" -ForegroundColor Yellow
    Write-Host "   [ ] Is Google Sheets API enabled in Google Cloud Console?" -ForegroundColor Gray
    Write-Host "   [ ] Is the service account email correct in .env?" -ForegroundColor Gray
    Write-Host "   [ ] Is the private key correct in .env?" -ForegroundColor Gray
    Write-Host "   [ ] Did you share your Google Sheet with the service account?" -ForegroundColor Gray
    Write-Host "   [ ] Is GOOGLE_SHEET_ID correct in .env?" -ForegroundColor Gray
    Write-Host "   [ ] Did you restart the backend after changing .env?`n" -ForegroundColor Gray
    
    Write-Host "   📖 See GOOGLE_SHEETS_EXPORT_GUIDE.md for detailed setup instructions.`n" -ForegroundColor Cyan
}

Write-Host "===================================`n" -ForegroundColor Cyan
Write-Host "Test complete!`n" -ForegroundColor Cyan
