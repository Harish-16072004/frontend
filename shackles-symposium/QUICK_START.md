# SHACKLES Project - Quick Start

## 🔗 Repository
**GitHub**: https://github.com/Harish-16072004/shackles

---

## 📂 Branch Structure

✅ **Created and Ready:**
- `master` - Production code
- `frontend-dev` - Frontend development (for you)
- `backend-dev` - Backend development (for your friend)

---

## 🚀 For You (Frontend Developer)

### Start Working:
```bash
cd "c:\Mechanical Association\Year 2025 - 2026\Website\shackles-symposium"
git checkout frontend-dev
git pull origin frontend-dev
```

### Make Changes:
```bash
# Work on files...
git add .
git commit -m "Your descriptive message"
git push origin frontend-dev
```

### Create Feature Branch (Optional):
```bash
git checkout frontend-dev
git checkout -b feature/your-feature-name
# Work and commit...
git push origin feature/your-feature-name
```

---

## 👥 For Your Friend (Backend Developer)

### Clone Repository:
```bash
git clone https://github.com/Harish-16072004/shackles.git
cd shackles
```

### Switch to Backend Branch:
```bash
git checkout backend-dev
git pull origin backend-dev
```

### Work on Backend:
```bash
cd server
npm install
cp .env.example .env
# Edit .env with credentials

# Make changes...
git add .
git commit -m "Add authentication API"
git push origin backend-dev
```

---

## 📋 Daily Commands

| Action | Command |
|--------|---------|
| Check current branch | `git branch` |
| Switch branch | `git checkout branch-name` |
| See changes | `git status` |
| Pull latest | `git pull origin branch-name` |
| Add files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch-name` |

---

## 🔄 Syncing Changes

### Update Your Branch:
```bash
git checkout frontend-dev
git pull origin frontend-dev
```

### Merge to Master (When Ready):
```bash
git checkout master
git pull origin master
git merge frontend-dev
git push origin master
```

---

## 📚 Documentation Files

- `GIT_WORKFLOW.md` - Complete Git guide
- `DATABASE_STRUCTURE.md` - Database schema
- `BACKEND_SETUP.md` - Backend setup guide

---

## 🆘 Emergency Commands

**Discard all local changes:**
```bash
git reset --hard HEAD
git pull origin branch-name
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**See what you did:**
```bash
git log --oneline
git reflog
```

---

## ✉️ Share with Your Friend

**Send them this:**

Repository: https://github.com/Harish-16072004/shackles

Setup:
```bash
git clone https://github.com/Harish-16072004/shackles.git
cd shackles
git checkout backend-dev
cd server
npm install
```

Documentation:
- Read `BACKEND_SETUP.md`
- Read `DATABASE_STRUCTURE.md`
- Read `GIT_WORKFLOW.md`

---

## 🎯 Current Status

✅ All folder structure pushed
✅ Master branch ready
✅ Frontend-dev branch created
✅ Backend-dev branch created
✅ Documentation added
✅ Ready to collaborate!

**Start coding!** 🚀
