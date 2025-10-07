# Frontend Style Migration Script
# Converts frontend folder to match frontend1 structure (except buttons)

Write-Host "🎨 Frontend Style Migration Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend"
$frontend1Path = "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\frontend1"

# Check if paths exist
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: frontend folder not found at $frontendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontend1Path)) {
    Write-Host "❌ Error: frontend1 folder not found at $frontend1Path" -ForegroundColor Red
    exit 1
}

# Step 1: Backup
Write-Host "1. Creating backup..." -ForegroundColor Yellow
$backupName = "frontend-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$backupPath = "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium\$backupName"

try {
    Copy-Item -Path $frontendPath -Destination $backupPath -Recurse -ErrorAction Stop
    Write-Host "   ✅ Backup created: $backupName" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Copy index.css from frontend1
Write-Host "2. Updating index.css..." -ForegroundColor Yellow
try {
    Copy-Item -Path "$frontend1Path\src\index.css" -Destination "$frontendPath\src\index.css" -Force -ErrorAction Stop
    Write-Host "   ✅ index.css updated (consolidated global styles)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed to update index.css: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Move CSS files from styles/ to pages/
Write-Host "3. Moving CSS files from styles/ to pages/..." -ForegroundColor Yellow

$moves = @(
    @{Src="styles\Home.css"; Dst="pages\Home.css"},
    @{Src="styles\Workshop.css"; Dst="pages\Workshop.css"},
    @{Src="styles\Team.css"; Dst="pages\Team.css"},
    @{Src="styles\Contact.css"; Dst="pages\Contact.css"},
    @{Src="styles\Accommodation.css"; Dst="pages\Accommodation.css"},
    @{Src="styles\Login.css"; Dst="pages\Auth\Login.css"},
    @{Src="styles\Register.css"; Dst="pages\Auth\Register.css"},
    @{Src="styles\Profile.css"; Dst="pages\Auth\Profile.css"},
    @{Src="styles\ForgotPassword.css"; Dst="pages\Auth\ForgotPassword.css"},
    @{Src="styles\ResetPassword.css"; Dst="pages\Auth\ResetPassword.css"},
    @{Src="styles\Events.css"; Dst="pages\Events\Events.css"},
    @{Src="styles\Technical.css"; Dst="pages\Events\Technical.css"},
    @{Src="styles\AdminDashboard.css"; Dst="pages\Admin\AdminDashboard.css"}
)

$movedCount = 0
$notFoundCount = 0

foreach ($move in $moves) {
    $srcPath = Join-Path "$frontendPath\src" $move.Src
    $dstPath = Join-Path "$frontendPath\src" $move.Dst
    
    if (Test-Path $srcPath) {
        try {
            Move-Item -Path $srcPath -Destination $dstPath -Force -ErrorAction Stop
            Write-Host "   ✅ Moved: $($move.Src) → $($move.Dst)" -ForegroundColor Gray
            $movedCount++
        } catch {
            Write-Host "   ❌ Failed to move $($move.Src): $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "   ⚠️  Not found: $($move.Src)" -ForegroundColor Yellow
        $notFoundCount++
    }
}

Write-Host ""
Write-Host "   Summary: $movedCount files moved, $notFoundCount not found" -ForegroundColor Cyan
Write-Host ""

# Step 4: Update Header.css
Write-Host "4. Updating Header.css..." -ForegroundColor Yellow
try {
    Copy-Item -Path "$frontend1Path\src\components\common\Header.css" -Destination "$frontendPath\src\components\common\Header.css" -Force -ErrorAction Stop
    Write-Host "   ✅ Header.css updated (hover colors and maintenance overrides)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed to update Header.css: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Copy App.css (minimal version)
Write-Host "5. Updating App.css..." -ForegroundColor Yellow
try {
    Copy-Item -Path "$frontend1Path\src\App.css" -Destination "$frontendPath\src\App.css" -Force -ErrorAction Stop
    Write-Host "   ✅ App.css updated" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ❌ Failed to update App.css: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Delete styles folder
Write-Host "6. Cleaning up styles/ folder..." -ForegroundColor Yellow
$stylesPath = "$frontendPath\src\styles"
if (Test-Path $stylesPath) {
    # Check if folder is empty or only has variables.css and globals.css
    $remainingFiles = Get-ChildItem -Path $stylesPath -File
    
    if ($remainingFiles.Count -eq 0 -or ($remainingFiles.Name -contains "variables.css" -and $remainingFiles.Name -contains "globals.css" -and $remainingFiles.Count -eq 2)) {
        try {
            Remove-Item -Path $stylesPath -Recurse -Force -ErrorAction Stop
            Write-Host "   ✅ styles/ folder removed" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not remove styles/ folder: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  styles/ folder has $($remainingFiles.Count) remaining files:" -ForegroundColor Yellow
        foreach ($file in $remainingFiles) {
            Write-Host "      - $($file.Name)" -ForegroundColor Gray
        }
        Write-Host "   Manual cleanup recommended" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ℹ️  styles/ folder already removed" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Migration Complete!" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "📋 Summary of Changes:" -ForegroundColor Cyan
Write-Host "   • index.css: Consolidated global styles" -ForegroundColor White
Write-Host "   • Header.css: Updated hover effects" -ForegroundColor White
Write-Host "   • App.css: Updated to minimal version" -ForegroundColor White
Write-Host "   • $movedCount CSS files moved to pages/" -ForegroundColor White
Write-Host "   • styles/ folder cleaned up" -ForegroundColor White
Write-Host ""

# Important notice
Write-Host "⚠️  IMPORTANT: Manual Steps Required!" -ForegroundColor Yellow
Write-Host ""
Write-Host "You must update import statements in the following files:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Page Components:" -ForegroundColor Cyan
Write-Host "  1. src/pages/Home.jsx" -ForegroundColor White
Write-Host "     Change: import '../styles/Home.css';" -ForegroundColor Gray
Write-Host "     To:     import './Home.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  2. src/pages/Workshop.jsx" -ForegroundColor White
Write-Host "     Change: import '../styles/Workshop.css';" -ForegroundColor Gray
Write-Host "     To:     import './Workshop.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  3. src/pages/Team.jsx" -ForegroundColor White
Write-Host "     Change: import '../styles/Team.css';" -ForegroundColor Gray
Write-Host "     To:     import './Team.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  4. src/pages/Contact.jsx" -ForegroundColor White
Write-Host "     Change: import '../styles/Contact.css';" -ForegroundColor Gray
Write-Host "     To:     import './Contact.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  5. src/pages/Accommodation.jsx" -ForegroundColor White
Write-Host "     Change: import '../styles/Accommodation.css';" -ForegroundColor Gray
Write-Host "     To:     import './Accommodation.css';" -ForegroundColor Green
Write-Host ""
Write-Host "Auth Components:" -ForegroundColor Cyan
Write-Host "  6. src/pages/Auth/Login.jsx" -ForegroundColor White
Write-Host "     Change: import '../../styles/Login.css';" -ForegroundColor Gray
Write-Host "     To:     import './Login.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  7. src/pages/Auth/Register.jsx" -ForegroundColor White
Write-Host "     Change: import '../../styles/Register.css';" -ForegroundColor Gray
Write-Host "     To:     import './Register.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  8. src/pages/Auth/Profile.jsx" -ForegroundColor White
Write-Host "     Change: import '../../styles/Profile.css';" -ForegroundColor Gray
Write-Host "     To:     import './Profile.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  9. src/pages/Auth/ForgotPassword.jsx" -ForegroundColor White
Write-Host "     Change: import '../../styles/ForgotPassword.css';" -ForegroundColor Gray
Write-Host "     To:     import './ForgotPassword.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  10. src/pages/Auth/ResetPassword.jsx" -ForegroundColor White
Write-Host "      Change: import '../../styles/ResetPassword.css';" -ForegroundColor Gray
Write-Host "      To:     import './ResetPassword.css';" -ForegroundColor Green
Write-Host ""
Write-Host "Events Components:" -ForegroundColor Cyan
Write-Host "  11. src/pages/Events/Events.jsx" -ForegroundColor White
Write-Host "      Change: import '../../styles/Events.css';" -ForegroundColor Gray
Write-Host "      To:     import './Events.css';" -ForegroundColor Green
Write-Host ""
Write-Host "  12. src/pages/Events/Technical.jsx" -ForegroundColor White
Write-Host "      Change: import '../../styles/Technical.css';" -ForegroundColor Gray
Write-Host "      To:     import './Technical.css';" -ForegroundColor Green
Write-Host ""
Write-Host "Admin Components:" -ForegroundColor Cyan
Write-Host "  13. src/pages/Admin/AdminDashboard.jsx" -ForegroundColor White
Write-Host "      Change: import '../../styles/AdminDashboard.css';" -ForegroundColor Gray
Write-Host "      To:     import './AdminDashboard.css';" -ForegroundColor Green
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Full documentation: FRONTEND_MIGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 Rollback command (if needed):" -ForegroundColor Yellow
Write-Host "   Remove-Item frontend -Recurse -Force" -ForegroundColor Gray
Write-Host "   Copy-Item $backupName -Destination frontend -Recurse" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next: Update import statements, then test with 'npm start'" -ForegroundColor Green
Write-Host ""
