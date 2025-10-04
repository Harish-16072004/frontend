# 🚀 Git Commands - Quick Reference

## ✅ Your .gitignore is Updated!

All sensitive files are now protected. Here are the commands you need:

---

## 📋 Before First Commit

### 1. Check Current Status
```powershell
cd "c:\Users\Harish J\Desktop\shackles-master\shackles-symposium"
git status
```

### 2. See What's Ignored
```powershell
git status --ignored
```

### 3. Verify .env is Protected
```powershell
git check-ignore backend/.env
# Should output: backend/.env ✅
```

---

## 📦 Staging Files

### Stage All Changes
```powershell
git add .
```

### Stage Specific Files
```powershell
# Add documentation
git add *.md

# Add backend code
git add backend/src/

# Add frontend code
git add frontend/src/
```

### Unstage Files
```powershell
# Unstage all
git reset

# Unstage specific file
git reset backend/.env
```

---

## 💾 Committing Changes

### Make a Commit
```powershell
git commit -m "feat: implement forgot password functionality"
```

### Commit with Detailed Message
```powershell
git commit -m "feat: add Google Sheets export

- Implemented dual authentication (JSON file + env vars)
- Added export formatting with blue headers
- Created comprehensive documentation
- Added test scripts for validation"
```

---

## 🔍 Checking Status

### See Modified Files
```powershell
git status
```

### See Changes in Files
```powershell
# See all changes
git diff

# See changes in specific file
git diff backend/src/controllers/authController.js

# See staged changes
git diff --staged
```

### See Ignored Files
```powershell
git status --ignored
```

---

## 🌿 Branch Management

### Create New Branch
```powershell
# Create and switch to new branch
git checkout -b feature/payment-verification

# Or with newer syntax
git switch -c feature/google-sheets-export
```

### Switch Branches
```powershell
git checkout stage2
# Or
git switch stage2
```

### List Branches
```powershell
git branch
```

---

## 📤 Pushing Changes

### Push to Current Branch
```powershell
git push origin stage2
```

### Push New Branch
```powershell
git push -u origin feature/forgot-password
```

### Force Push (⚠️ Use Carefully)
```powershell
git push --force origin stage2
```

---

## 🔄 Pulling Changes

### Pull Latest Changes
```powershell
git pull origin stage2
```

### Pull with Rebase
```powershell
git pull --rebase origin stage2
```

---

## 🧹 Cleaning Up

### Remove Untracked Files (Dry Run)
```powershell
git clean -n
```

### Remove Untracked Files (For Real)
```powershell
git clean -f
```

### Remove Untracked Directories
```powershell
git clean -fd
```

---

## 🆘 Emergency Commands

### Accidentally Committed .env File?
```powershell
# Remove from git but keep locally
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
git push

# Then IMMEDIATELY rotate all credentials!
```

### Undo Last Commit (Keep Changes)
```powershell
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```powershell
git reset --hard HEAD~1
```

### Discard All Local Changes
```powershell
git reset --hard HEAD
```

---

## 📊 Viewing History

### View Commit History
```powershell
git log

# Compact view
git log --oneline

# Last 5 commits
git log -5

# With file changes
git log --stat
```

### View Specific File History
```powershell
git log backend/src/controllers/authController.js
```

---

## 🎯 Recommended Workflow

### 1. **Check Status**
```powershell
git status
```

### 2. **Pull Latest Changes**
```powershell
git pull origin stage2
```

### 3. **Make Changes**
(Edit your code)

### 4. **Check What Changed**
```powershell
git status
git diff
```

### 5. **Stage Changes**
```powershell
# Stage all
git add .

# Or stage specific files
git add backend/src/controllers/
```

### 6. **Verify Staged Changes**
```powershell
git status
git diff --staged
```

### 7. **Commit**
```powershell
git commit -m "feat: add payment verification system"
```

### 8. **Push**
```powershell
git push origin stage2
```

---

## ✅ Safe Commit Checklist

Before `git push`, verify:

- [ ] `.env` files are NOT staged
- [ ] `node_modules/` not included
- [ ] No `dist/` or `build/` folders
- [ ] No payment proof images
- [ ] No QR code files
- [ ] No database dumps
- [ ] Commit message is clear

**Check with:**
```powershell
git status
git diff --staged --name-only
```

---

## 🔐 Currently Protected Files

These are automatically ignored (won't be committed):

✅ **Environment Variables**
- `backend/.env`
- `frontend/.env`
- All `.env.*` files

✅ **Secrets & Credentials**
- `google-credentials.json`
- `*-service-account.json`
- `*.pem`, `*.key`

✅ **User Data**
- `payment-proof/`
- `participant-qr-code/`
- `/uploads`

✅ **Dependencies**
- `node_modules/`
- `package-lock.json` (optional)

✅ **Build Files**
- `dist/`
- `build/`
- `.cache/`

✅ **IDE Files**
- `.vscode/`
- `.idea/`

---

## 🎨 Commit Message Convention

Use these prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS/formatting
- `refactor:` - Code restructure
- `test:` - Add tests
- `chore:` - Maintenance

**Examples:**
```powershell
git commit -m "feat: implement Google Sheets export"
git commit -m "fix: resolve payment verification bug"
git commit -m "docs: add forgot password guide"
git commit -m "style: reorganize CSS files"
git commit -m "refactor: improve auth controller"
git commit -m "chore: update dependencies"
```

---

## 📝 Quick Commands Summary

```powershell
# Check status
git status

# Stage all changes
git add .

# Commit
git commit -m "your message"

# Push
git push origin stage2

# Pull latest
git pull origin stage2

# See history
git log --oneline

# Undo changes
git reset --hard HEAD

# Check ignored files
git status --ignored
```

---

## 🚀 Ready to Commit!

Your `.gitignore` is configured. You can safely commit your code now!

**Next steps:**
1. Review changes: `git status`
2. Stage files: `git add .`
3. Commit: `git commit -m "feat: implement complete backend features"`
4. Push: `git push origin stage2`

All sensitive data is protected! 🎉
