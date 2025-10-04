# 📖 Documentation Index - SHACKLES Symposium

## 🎯 Start H### 🚀 Startup Scripts
| File | Purpose | How to Use |
|------|---------|------------|
| **`start-backend.ps1`** | Start backend server | Double-click or `.\start-backend.ps1` |
| **`start-frontend.ps1`** | Start frontend server | Double-click or `.\start-frontend.ps1` |
| **`start-all.ps1`** | Start both servers | Double-click or `.\start-all.ps1` |
| **`setup-mongodb.ps1`** | MongoDB setup helper | `.\setup-mongodb.ps1` |
| **`test-google-sheets.ps1`** | Test Google Sheets export | `.\test-google-sheets.ps1` |
**New to connecting frontend and backend?** Start with:
1. **`README_CONNECTION_SETUP.md`** - Summary & checklist
2. **`CONNECTION_QUICK_START.md`** - 5-minute quick guide
3. **`CONNECTING_GUIDE_FOR_BEGINNERS.md`** - Detailed 30-page guide

---

## 📚 All Documentation

### 🔌 Connection & Setup Guides
| File | Purpose | Time | Audience |
|------|---------|------|----------|
| **`README_CONNECTION_SETUP.md`** | Overview & next steps | 2 min | Everyone |
| **`CONNECTION_QUICK_START.md`** | Fast setup guide | 5 min | Experienced developers |
| **`CONNECTING_GUIDE_FOR_BEGINNERS.md`** | Complete tutorial | 30 min | Beginners |
| **`CONNECTION_ARCHITECTURE_DIAGRAM.txt`** | Visual diagrams | 10 min | Visual learners |

### 🎨 Frontend Documentation
| File | Purpose |
|------|---------|
| **`frontend/CSS_STRUCTURE.md`** | CSS organization guide |
| **`frontend/CSS_REORGANIZATION_SUMMARY.md`** | CSS changes summary |
| **`frontend/CSS_QUICK_REFERENCE.md`** | CSS quick reference |
| **`frontend/CSS_REORGANIZATION_CHECKLIST.md`** | CSS reorganization tasks |

### ⚙️ Backend Documentation
| File | Purpose |
|------|---------|
| **`BACKEND_SETUP.md`** | Backend configuration |
| **`BACKEND_STATUS.md`** | Backend status & features |
| **`BACKEND_COMPLETE.md`** | Backend completion report |
| **`DATABASE_STRUCTURE.md`** | MongoDB schema design |

### 📊 Database Documentation
| File | Purpose |
|------|---------|
| **`MONGODB_ATLAS_SETUP.md`** | MongoDB Atlas configuration |
| **`MONGODB_QUICK_START.md`** | Quick MongoDB guide |
| **`MONGODB_REFERENCE.md`** | MongoDB commands reference |
| **`DATABASE_STRUCTURE.md`** | Database schema details |

### 🔧 Git & Workflow
| File | Purpose |
|------|---------|
| **`GIT_WORKFLOW.md`** | Git branching strategy |

### � Export & Data Management (NEW!)
| File | Purpose | Time | Status |
|------|---------|------|--------|
| **`EXPORT_COMPARISON.md`** | ⭐ Compare Excel/Sheets/PDF | 5 min | ✅ Start here! |
| **`ADMIN_EXPORT_GUIDE.md`** | Excel & PDF export guide | 15 min | ✅ Ready to use |
| **`GOOGLE_SHEETS_QUICK_START.md`** | ⭐ Fast Google Sheets setup | 5 min | ⏳ Setup needed |
| **`GOOGLE_SHEETS_EXPORT_GUIDE.md`** | Complete Google Sheets guide | 30 min | ⏳ Setup needed |
| **`GOOGLE_SHEETS_VISUAL_GUIDE.md`** | Visual diagrams & flowcharts | 15 min | 📖 Reference |
| **`GOOGLE_SHEETS_SUMMARY.md`** | Google Sheets docs overview | 5 min | 📖 Reference |
| **`PAYMENT_VERIFICATION_COMPLETE.md`** | Payment verification system | 20 min | ✅ Complete |
| **`CANCELLATION_REMOVED.md`** | Cancellation policy changes | 5 min | ✅ Info |

### �🚀 Startup Scripts
| File | Purpose | How to Use |
|------|---------|------------|
| **`start-backend.ps1`** | Start backend server | Double-click or `.\start-backend.ps1` |
| **`start-frontend.ps1`** | Start frontend server | Double-click or `.\start-frontend.ps1` |
| **`start-all.ps1`** | Start both servers | Double-click or `.\start-all.ps1` |
| **`setup-mongodb.ps1`** | MongoDB setup helper | `.\setup-mongodb.ps1` |

---

## 🗺️ Documentation Roadmap

### Phase 1: Getting Started (You are here! ✅)
- [x] Connection guides created
- [x] Environment files configured
- [x] Startup scripts provided
- [ ] **Next:** Set up MongoDB (STEP 1)
- [ ] **Next:** Start servers (STEP 4)

### Phase 2: Development
- [ ] Understand codebase structure
- [ ] Test all features
- [ ] Add new features
- [ ] Configure optional services

### Phase 3: Production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure production database
- [ ] Set up monitoring

---

## 🎯 Quick Navigation

### I want to...

**...connect frontend and backend**
→ Read `README_CONNECTION_SETUP.md`

**...export data to Excel**
→ Read `ADMIN_EXPORT_GUIDE.md` - Works now! No setup needed ✅

**...export to Google Sheets**
→ Read `GOOGLE_SHEETS_QUICK_START.md` - 10-15 min setup ⏳

**...generate PDF tickets**
→ Read `ADMIN_EXPORT_GUIDE.md` - Works now! No setup needed ✅

**...understand the payment system**
→ Read `PAYMENT_VERIFICATION_COMPLETE.md`

**...understand the CSS structure**
→ Read `frontend/CSS_STRUCTURE.md`

**...set up MongoDB**
→ Read `MONGODB_ATLAS_SETUP.md`

**...see backend API endpoints**
→ Read `BACKEND_STATUS.md`

**...understand database schema**
→ Read `DATABASE_STRUCTURE.md`

**...learn Git workflow**
→ Read `GIT_WORKFLOW.md`

**...start the servers quickly**
→ Double-click `start-all.ps1`

---

## 📊 Project Structure

```
shackles-symposium/
│
├── 📄 README_CONNECTION_SETUP.md      ← START HERE
├── 📄 CONNECTION_QUICK_START.md
├── 📄 CONNECTING_GUIDE_FOR_BEGINNERS.md
├── 📄 CONNECTION_ARCHITECTURE_DIAGRAM.txt
│
├── 🎨 frontend/
│   ├── src/                           (React source code)
│   ├── .env                           ← Configure this!
│   ├── CSS_STRUCTURE.md
│   ├── CSS_QUICK_REFERENCE.md
│   └── package.json
│
├── ⚙️ backend/
│   ├── src/                           (Node.js source code)
│   ├── .env                           ← Configure this!
│   └── package.json
│
├── 🗄️ server/
│   └── (Alternative backend setup)
│
├── 🚀 start-backend.ps1               ← Double-click to start
├── 🚀 start-frontend.ps1              ← Double-click to start
├── 🚀 start-all.ps1                   ← Double-click to start both
│
└── 📚 Documentation/
    ├── BACKEND_*.md
    ├── MONGODB_*.md
    ├── DATABASE_*.md
    └── GIT_WORKFLOW.md
```

---

## 🎓 Learning Path

### Absolute Beginner Path
1. Read `README_CONNECTION_SETUP.md` (2 min)
2. Read `CONNECTING_GUIDE_FOR_BEGINNERS.md` (30 min)
3. Look at `CONNECTION_ARCHITECTURE_DIAGRAM.txt` (10 min)
4. Follow setup steps
5. Start servers and test
6. Read `frontend/CSS_STRUCTURE.md` to understand frontend
7. Read `BACKEND_STATUS.md` to understand backend

### Intermediate Developer Path
1. Read `CONNECTION_QUICK_START.md` (5 min)
2. Check `.env` files
3. Run `npm install` in both folders
4. Double-click `start-all.ps1`
5. Test connection
6. Read `DATABASE_STRUCTURE.md` for schema
7. Read `BACKEND_STATUS.md` for API endpoints

### Expert Developer Path
1. Scan `README_CONNECTION_SETUP.md`
2. Update `.env` files
3. `npm install && npm run dev` (both folders)
4. Done! 🚀

---

## ✅ Completion Checklist

### Documentation Read
- [ ] `README_CONNECTION_SETUP.md`
- [ ] Connection guide (Quick or Detailed)
- [ ] Architecture diagram

### Setup Completed
- [ ] MongoDB Atlas account created
- [ ] Database user & cluster set up
- [ ] `.env` files configured
- [ ] Dependencies installed (`npm install`)

### Servers Running
- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:5173
- [ ] Health check passes
- [ ] Can register/login successfully

### Understanding Achieved
- [ ] Know where frontend code is
- [ ] Know where backend code is
- [ ] Understand how they connect
- [ ] Know where database is configured

---

## 🆘 Troubleshooting Index

### Connection Issues
→ See `CONNECTING_GUIDE_FOR_BEGINNERS.md` Section: "Common Issues & Solutions"

### MongoDB Issues
→ See `MONGODB_QUICK_START.md` Section: "Troubleshooting"

### Frontend/CSS Issues
→ See `frontend/CSS_STRUCTURE.md` Section: "Troubleshooting"

### Backend API Issues
→ See `BACKEND_SETUP.md` Section: "Troubleshooting"

### Git Issues
→ See `GIT_WORKFLOW.md`

---

## 📞 Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║                   QUICK REFERENCE                          ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  🌐 Frontend:  http://localhost:5173                      ║
║  ⚙️  Backend:   http://localhost:5000                      ║
║  💚 Health:    http://localhost:5000/health               ║
║  🗄️  Database:  MongoDB Atlas (cloud)                     ║
║                                                            ║
║  📁 Frontend env: frontend/.env                           ║
║  📁 Backend env:  backend/.env                            ║
║                                                            ║
║  🚀 Start Backend:  .\start-backend.ps1                   ║
║  🚀 Start Frontend: .\start-frontend.ps1                  ║
║  🚀 Start Both:     .\start-all.ps1                       ║
║                                                            ║
║  📖 Main Guide: CONNECTING_GUIDE_FOR_BEGINNERS.md         ║
║  ⚡ Quick Start: CONNECTION_QUICK_START.md                ║
║  🎨 CSS Guide:   frontend/CSS_STRUCTURE.md                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎉 What's Been Done

### ✅ Environment Setup
- Backend `.env` created with all configurations
- Frontend `.env` created with API URL
- Both files pre-configured (just need MongoDB URI!)

### ✅ Startup Scripts
- `start-backend.ps1` - Easy backend startup
- `start-frontend.ps1` - Easy frontend startup
- `start-all.ps1` - Start both with one click

### ✅ Documentation
- Complete beginner guide (30+ pages)
- Quick start guide (1 page)
- Architecture diagrams
- CSS structure documentation
- Troubleshooting guides

### ✅ CSS Reorganization
- Centralized CSS in `frontend/src/styles/`
- Design system with CSS variables
- Global utilities and components
- Complete CSS documentation

---

## 🎯 Next Steps

1. **Read:** `README_CONNECTION_SETUP.md` (this gives you the overview)
2. **Follow:** Steps 1-5 in that document
3. **Time:** 10-15 minutes total
4. **Result:** Everything running and connected!

---

## 📚 Additional Resources

### Official Documentation
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **Axios:** https://axios-http.com/

### Tutorials
- MongoDB University (free courses)
- React official tutorial
- Node.js guides

---

## 🏆 Success Indicators

You'll know everything is working when:

✅ Backend terminal shows "Database: Connected"  
✅ Frontend loads at http://localhost:5173  
✅ You can register a new user  
✅ You can login successfully  
✅ Events page loads data from backend  
✅ No CORS errors in browser console  

---

**Last Updated:** October 4, 2025  
**Status:** Ready for setup!  
**Start Here:** `README_CONNECTION_SETUP.md`

Happy coding! 🚀
