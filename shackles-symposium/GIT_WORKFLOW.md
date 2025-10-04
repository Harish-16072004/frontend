# Git Branching Strategy for SHACKLES Project

## Current Repository
- **Owner**: Harish-16072004
- **Repo**: shackles
- **URL**: https://github.com/Harish-16072004/shackles
- **Main Branch**: master

---

## Branching Strategy

We'll use a **Feature Branch Workflow** which is perfect for collaboration:

```
master (production-ready code)
  ├── frontend-dev (your work)
  │    ├── feature/home-page
  │    ├── feature/events-page
  │    └── feature/team-page
  │
  └── backend-dev (your friend's work)
       ├── feature/authentication
       ├── feature/events-api
       └── feature/registration-api
```

---

## Quick Start Guide

### For You (Frontend Developer)

#### 1. Create Your Development Branch
```bash
cd "c:\Mechanical Association\Year 2025 - 2026\Website\shackles-symposium"

# Create and switch to your frontend branch
git checkout -b frontend-dev

# Push it to GitHub
git push -u origin frontend-dev
```

#### 2. Work on Specific Features
```bash
# Create a feature branch from frontend-dev
git checkout frontend-dev
git checkout -b feature/home-page-fixes

# Make your changes...
git add .
git commit -m "Fix: Center section titles on home page"
git push origin feature/home-page-fixes
```

#### 3. Merge Your Work
```bash
# Switch back to frontend-dev
git checkout frontend-dev

# Merge your feature
git merge feature/home-page-fixes

# Push to GitHub
git push origin frontend-dev
```

---

### For Your Friend (Backend Developer)

#### 1. Clone the Repository
```bash
git clone https://github.com/Harish-16072004/shackles.git
cd shackles
```

#### 2. Create Backend Development Branch
```bash
# Create and switch to backend branch
git checkout -b backend-dev

# Push it to GitHub
git push -u origin backend-dev
```

#### 3. Work on Features
```bash
# Create a feature branch from backend-dev
git checkout backend-dev
git checkout -b feature/user-authentication

# Make changes...
git add .
git commit -m "Add user authentication with JWT"
git push origin feature/user-authentication
```

---

## Complete Workflow

### Initial Setup (Run These Commands Now)

```bash
# Navigate to your project
cd "c:\Mechanical Association\Year 2025 - 2026\Website\shackles-symposium"

# Create frontend branch (for you)
git checkout -b frontend-dev
git push -u origin frontend-dev

# Create backend branch (for your friend)
git checkout -b backend-dev
git push -u origin backend-dev

# Go back to master
git checkout master
```

---

## Daily Workflow

### For Frontend Developer (You)

**Starting Work:**
```bash
# Make sure you're on frontend-dev
git checkout frontend-dev

# Pull latest changes
git pull origin frontend-dev

# Create feature branch
git checkout -b feature/your-feature-name
```

**Committing Work:**
```bash
# Check what files changed
git status

# Add files
git add .
# Or add specific files
git add src/pages/Home.jsx src/pages/Home.css

# Commit with meaningful message
git commit -m "Fix: Section title centering issue"

# Push to GitHub
git push origin feature/your-feature-name
```

**Merging to Frontend-Dev:**
```bash
# Switch to frontend-dev
git checkout frontend-dev

# Pull latest changes
git pull origin frontend-dev

# Merge your feature
git merge feature/your-feature-name

# Push merged code
git push origin frontend-dev

# Delete feature branch (optional)
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

### For Backend Developer (Your Friend)

**Same workflow but with `backend-dev` instead of `frontend-dev`:**

```bash
# Starting work
git checkout backend-dev
git pull origin backend-dev
git checkout -b feature/authentication

# Work and commit
git add .
git commit -m "Add JWT authentication"
git push origin feature/authentication

# Merge back
git checkout backend-dev
git pull origin backend-dev
git merge feature/authentication
git push origin backend-dev
```

---

## Merging to Master (Production)

When both frontend and backend are tested and ready:

```bash
# Switch to master
git checkout master

# Pull latest master
git pull origin master

# Merge frontend-dev
git merge frontend-dev

# Merge backend-dev
git merge backend-dev

# Push to master
git push origin master
```

---

## Common Git Commands

### Branch Management
```bash
# List all branches
git branch -a

# Switch branches
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

### Checking Status
```bash
# Check current branch and changes
git status

# View commit history
git log --oneline

# View changes
git diff

# View changes in staged files
git diff --staged
```

### Undoing Changes
```bash
# Discard changes in working directory
git checkout -- filename

# Unstage file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Syncing with Remote
```bash
# Fetch all branches
git fetch --all

# Pull changes from remote
git pull origin branch-name

# Push to remote
git push origin branch-name

# Push all branches
git push --all origin
```

---

## Resolving Merge Conflicts

If you get conflicts when merging:

1. **Git will mark conflicts in files:**
```javascript
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name
```

2. **Resolve manually:**
   - Edit the file
   - Remove the conflict markers
   - Keep the code you want

3. **Complete the merge:**
```bash
git add resolved-file.js
git commit -m "Resolve merge conflict"
git push origin branch-name
```

---

## GitHub Pull Requests (Recommended)

Instead of direct merging, use Pull Requests:

1. **Push your feature branch:**
```bash
git push origin feature/your-feature
```

2. **Go to GitHub**: https://github.com/Harish-16072004/shackles

3. **Click "Pull requests" → "New pull request"**

4. **Select**:
   - Base: `frontend-dev` (or `master`)
   - Compare: `feature/your-feature`

5. **Create pull request** with description

6. **Review and merge** on GitHub

---

## Best Practices

### Commit Messages
✅ **Good:**
```
Add user authentication with JWT
Fix: Section title centering on home page
Update: Team page grid layout to 4 columns
Refactor: Event card component for better responsiveness
```

❌ **Bad:**
```
fixed stuff
update
changes
wip
```

### Commit Frequency
- Commit after each logical change
- Don't commit broken code
- Commit before switching branches

### Branch Naming
**Frontend:**
- `feature/home-page-updates`
- `feature/event-cards-styling`
- `fix/mobile-navigation`
- `refactor/hero-section`

**Backend:**
- `feature/user-authentication`
- `feature/event-registration-api`
- `fix/database-connection`
- `refactor/error-handling`

---

## Collaboration Workflow

### When Working Separately
1. You work on `frontend-dev`
2. Friend works on `backend-dev`
3. Both merge to `master` when ready

### When Integration Needed
1. Create an `integration` branch
2. Merge both `frontend-dev` and `backend-dev` into it
3. Test everything together
4. If OK, merge `integration` to `master`

```bash
# Create integration branch
git checkout master
git checkout -b integration

# Merge both dev branches
git merge frontend-dev
git merge backend-dev

# Test everything...

# If OK, merge to master
git checkout master
git merge integration
git push origin master
```

---

## Useful Git Aliases (Optional)

Add these to your `.gitconfig` for shortcuts:

```bash
# View current aliases
git config --global --list

# Add aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.pl "pull origin"
git config --global alias.ps "push origin"

# Usage:
git st        # instead of git status
git co master # instead of git checkout master
git cm "message" # instead of git commit -m "message"
```

---

## Emergency: Undo Everything and Start Fresh

If things get messy:

```bash
# Discard all local changes
git reset --hard HEAD

# Get latest from remote
git pull origin branch-name

# If still problematic, delete local branch and recreate
git checkout master
git branch -D problematic-branch
git fetch origin
git checkout -b problematic-branch origin/problematic-branch
```

---

## File to Share with Your Friend

Send your friend this info:

**Repository Access:**
```
Repository: https://github.com/Harish-16072004/shackles
Branch for Backend: backend-dev
```

**Setup Commands:**
```bash
# Clone repository
git clone https://github.com/Harish-16072004/shackles.git
cd shackles

# Switch to backend branch
git checkout backend-dev

# Install dependencies
cd server
npm install

# Set up environment
cp .env.example .env
# Edit .env with your details

# Start working
git checkout -b feature/authentication
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| Check status | `git status` |
| Add files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin branch-name` |
| Pull | `git pull origin branch-name` |
| Merge | `git merge source-branch` |
| View branches | `git branch -a` |
| Delete branch | `git branch -d branch-name` |

---

## Support

If you run into issues:
1. Check `git status`
2. Check `git log --oneline`
3. Google the error message
4. Use `git reflog` to see all recent actions
5. Ask your friend for help!

---

## Next Steps

Run these commands now to set up your branches:

```bash
cd "c:\Mechanical Association\Year 2025 - 2026\Website\shackles-symposium"
git checkout -b frontend-dev
git push -u origin frontend-dev
git checkout -b backend-dev
git push -u origin backend-dev
git checkout master
```

Then share the repository link with your friend:
**https://github.com/Harish-16072004/shackles**

Good luck! 🚀
