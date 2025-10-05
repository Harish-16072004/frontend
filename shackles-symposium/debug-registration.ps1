# Debug Registration Endpoint

Write-Host "Testing Registration Endpoint..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check what error backend returns
Write-Host "[Test] Sending minimal data to see validation error..." -ForegroundColor Yellow

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "test@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Unexpected success: $response" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
    
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error Message: $($errorBody.message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This tells us what validation is failing!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Now check your browser console for the actual frontend error!" -ForegroundColor Cyan
