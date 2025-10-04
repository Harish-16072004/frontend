# SHACKLES MongoDB Atlas Setup Helper
# Run this to get step-by-step guidance

Write-Host "`n" -NoNewline
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   SHACKLES 25-26 MongoDB Atlas Setup" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Step 1: MongoDB Atlas Account Created" -ForegroundColor Green
Write-Host "✓ Step 2: .env file created in server folder" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT: Configure Your Connection String" -ForegroundColor Yellow
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Where to find your connection string:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Open MongoDB Atlas Dashboard" -ForegroundColor White
Write-Host "     → https://cloud.mongodb.com" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2. Click 'Connect' button on your cluster" -ForegroundColor White
Write-Host "     → Usually named 'shackles-cluster' or 'Cluster0'" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  3. Choose 'Connect your application'" -ForegroundColor White
Write-Host ""
Write-Host "  4. Select:" -ForegroundColor White
Write-Host "     - Driver: Node.js" -ForegroundColor DarkGray
Write-Host "     - Version: 5.5 or later" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  5. Copy the connection string" -ForegroundColor White
Write-Host "     → It looks like: mongodb+srv://username:<password>@..." -ForegroundColor DarkGray
Write-Host ""

Write-Host "📝 What to do with it:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Open: server\.env" -ForegroundColor White
Write-Host ""
Write-Host "  2. Find the line starting with MONGODB_URI=" -ForegroundColor White
Write-Host ""
Write-Host "  3. Replace it with YOUR connection string" -ForegroundColor White
Write-Host ""
Write-Host "  4. Important: Replace <password> with your actual password!" -ForegroundColor Yellow
Write-Host ""
Write-Host "  5. If password has special characters, encode them:" -ForegroundColor Yellow
Write-Host "     @ → %40" -ForegroundColor DarkGray
Write-Host "     # → %23" -ForegroundColor DarkGray
Write-Host "     $ → %24" -ForegroundColor DarkGray
Write-Host ""

Write-Host "📂 Example connection string:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Before:" -ForegroundColor Gray
Write-Host "  MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@..." -ForegroundColor DarkYellow
Write-Host ""
Write-Host "  After (with your details):" -ForegroundColor Gray
Write-Host "  MONGODB_URI=mongodb+srv://shackles_admin:MyPass%40123@shackles-cluster.abc12.mongodb.net/shackles_db?retryWrites=true&w=majority" -ForegroundColor Green
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Have you copied your connection string from MongoDB Atlas? (yes/no)"

if ($response -eq "yes" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Great! Now let's test the connection..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Running test-connection.js..." -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location "c:\Mechanical Association\Year 2025 - 2026\Website\shackles-symposium\server"
    node test-connection.js
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    
    $testSuccess = Read-Host "Did the connection test succeed? (yes/no)"
    
    if ($testSuccess -eq "yes" -or $testSuccess -eq "y") {
        Write-Host ""
        Write-Host "🎉 Excellent! Your MongoDB Atlas is connected!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Start your backend server:" -ForegroundColor White
        Write-Host "     cd server" -ForegroundColor DarkGray
        Write-Host "     npm run dev" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  2. Your database collections will be created automatically" -ForegroundColor White
        Write-Host ""
        Write-Host "  3. Share the .env credentials with your backend developer" -ForegroundColor White
        Write-Host "     (via secure method, NOT through git!)" -ForegroundColor DarkYellow
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Connection test failed. Let's troubleshoot:" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "  ❌ Wrong username or password" -ForegroundColor White
        Write-Host "     → Double-check credentials in MongoDB Atlas" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  ❌ Special characters not encoded in password" -ForegroundColor White
        Write-Host "     → Use @ as %40, # as %23, etc." -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  ❌ IP not whitelisted" -ForegroundColor White
        Write-Host "     → Add 0.0.0.0/0 in Network Access" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "  ❌ Wrong cluster URL" -ForegroundColor White
        Write-Host "     → Copy exact URL from Atlas dashboard" -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "📚 Check MONGODB_ATLAS_SETUP.md for detailed troubleshooting" -ForegroundColor Cyan
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "No problem! Here's what to do:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. Go to: https://cloud.mongodb.com" -ForegroundColor White
    Write-Host "  2. Find your cluster (usually 'shackles-cluster')" -ForegroundColor White
    Write-Host "  3. Click the 'Connect' button" -ForegroundColor White
    Write-Host "  4. Choose 'Connect your application'" -ForegroundColor White
    Write-Host "  5. Copy the connection string" -ForegroundColor White
    Write-Host "  6. Update server\.env file with it" -ForegroundColor White
    Write-Host "  7. Run this script again!" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run manually:" -ForegroundColor Gray
    Write-Host "  cd server" -ForegroundColor DarkGray
    Write-Host "  node test-connection.js" -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
