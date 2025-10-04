#!/usr/bin/env pwsh
# Generate JWT Secret - Helper Script for SHACKLES 2025
# This script generates a secure JWT secret and helps you update .env

Write-Host "`n🔐 JWT Secret Generator" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Check if Node.js is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node -v 2>$null
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Generate JWT Secret
Write-Host "`n🔑 Generating secure JWT secret..." -ForegroundColor Yellow

$jwtSecret = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Write-Host "`n✅ JWT Secret Generated Successfully!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray

Write-Host "`nYour new JWT Secret:" -ForegroundColor Cyan
Write-Host $jwtSecret -ForegroundColor Yellow

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray

# Provide instructions
Write-Host "`n📝 How to Use This Secret:" -ForegroundColor Cyan
Write-Host "1. Copy the yellow text above (your JWT secret)" -ForegroundColor White
Write-Host "2. Open backend/.env file" -ForegroundColor White
Write-Host "3. Find the line: JWT_SECRET=..." -ForegroundColor White
Write-Host "4. Replace with: JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "5. Save the file" -ForegroundColor White
Write-Host "6. Restart your backend server" -ForegroundColor White

Write-Host "`n🔒 Security Tips:" -ForegroundColor Cyan
Write-Host "✅ This secret is 128 characters long (very secure)" -ForegroundColor Green
Write-Host "✅ Never share this secret publicly" -ForegroundColor Green
Write-Host "✅ Never commit .env file to GitHub" -ForegroundColor Green
Write-Host "✅ Use different secrets for development and production" -ForegroundColor Green

# Ask if user wants to automatically update .env
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
$response = Read-Host "`nDo you want to automatically update backend/.env? (y/n)"

if ($response -eq 'y' -or $response -eq 'Y') {
    $envPath = ".\backend\.env"
    
    if (Test-Path $envPath) {
        Write-Host "`n📝 Updating backend/.env..." -ForegroundColor Yellow
        
        # Read the .env file
        $envContent = Get-Content $envPath -Raw
        
        # Create backup
        $backupPath = ".\backend\.env.backup"
        Copy-Item $envPath $backupPath -Force
        Write-Host "✅ Backup created: backend/.env.backup" -ForegroundColor Green
        
        # Replace JWT_SECRET
        $envContent = $envContent -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret"
        
        # Save the file
        Set-Content $envPath $envContent -NoNewline
        
        Write-Host "✅ JWT_SECRET updated in backend/.env!" -ForegroundColor Green
        Write-Host "`n🎉 Done! Your backend is now using a secure JWT secret." -ForegroundColor Cyan
        Write-Host "`n⚠️  Remember to restart your backend server for changes to take effect!" -ForegroundColor Yellow
        Write-Host "   Run: cd backend; npm run dev" -ForegroundColor White
    } else {
        Write-Host "`n❌ backend/.env file not found!" -ForegroundColor Red
        Write-Host "Please create it first or update manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "`n📋 Manual Update Required:" -ForegroundColor Yellow
    Write-Host "Copy this line and paste it in backend/.env:" -ForegroundColor White
    Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Yellow
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "✅ Script complete!" -ForegroundColor Green
Write-Host "`n💡 For more information, read: JWT_SECRET_GUIDE.md" -ForegroundColor Cyan
Write-Host "`n"
