# 🗄️ How to View User Data in MongoDB Atlas

## 📊 Method 1: MongoDB Atlas Web Interface (Recommended for Beginners)

### Steps:

1. **Go to MongoDB Atlas:**
   ```
   https://cloud.mongodb.com/
   ```

2. **Login** with your credentials:
   - Username: HarishJ16
   - Password: Loki2403

3. **Navigate to Your Cluster:**
   - Click on your cluster: `shackles2k25`
   - Click **"Browse Collections"** button

4. **View Your Database:**
   - Select database: `shackles_db`
   - Select collection: `users`
   - You'll see all registered users!

5. **What You'll See:**
   ```json
   {
     "_id": "68e125d3b31e7aa0494d9d0b",
     "name": "Harish J",
     "email": "harish@test.com",
     "phone": "9876543210",
     "college": "ACGCET",
     "department": "Mechanical Engineering",
     "year": "3",
     "password": "$2a$10$...", // Hashed password
     "role": "user",
     "isVerified": false,
     "createdAt": "2025-01-01T12:00:00.000Z",
     "updatedAt": "2025-01-01T12:00:00.000Z"
   }
   ```

---

## 🖥️ Method 2: MongoDB Compass (Desktop App)

### Install MongoDB Compass:
```
https://www.mongodb.com/try/download/compass
```

### Connect to Your Database:

1. **Open MongoDB Compass**
2. **Paste your connection string:**
   ```
   mongodb+srv://HarishJ16:Loki2403@shackles2k25.seectqm.mongodb.net/shackles_db
   ```
3. **Click "Connect"**
4. **Browse Collections:**
   - Database: `shackles_db`
   - Collection: `users`

### Benefits:
- ✅ Visual query builder
- ✅ Easy data editing
- ✅ Export data to JSON/CSV
- ✅ Better performance than web interface

---

## 💻 Method 3: Using Backend API (Your Current Setup)

### Get All Users (Admin Only):
```powershell
# Login as admin first
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$token = $loginResponse.token

# Get all users
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/users" -Method Get -Headers $headers
```

### Get Current User:
```powershell
# Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$token = $loginResponse.token

# Get your profile
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -Headers $headers
```

---

## 📝 Method 4: MongoDB Shell (mongosh)

### Install MongoDB Shell:
```
https://www.mongodb.com/try/download/shell
```

### Connect and Query:
```bash
# Connect to your database
mongosh "mongodb+srv://HarishJ16:Loki2403@shackles2k25.seectqm.mongodb.net/shackles_db"

# Show all users
db.users.find().pretty()

# Find specific user by email
db.users.findOne({ email: "harish@test.com" })

# Count total users
db.users.countDocuments()

# Find users by college
db.users.find({ college: "ACGCET" }).pretty()

# Find users by year
db.users.find({ year: "3" }).pretty()
```

---

## 🔧 Method 5: Create a Simple Admin Panel Endpoint

I can add an admin endpoint to view all users. Let me create it for you!

### New Endpoint:
```
GET /api/v1/admin/users
```

This will return:
- All users
- Total count
- Filtered by role, college, department, year

---

## 📊 Quick Database Stats

### Check All Collections:
```powershell
# Using your backend health endpoint
curl http://localhost:5000/health
```

### View Database Statistics via API:
I can create a `/api/v1/admin/stats` endpoint that shows:
- Total users
- Total registrations
- Total events
- Total workshops
- Users by college
- Users by year

---

## 🎯 Recommended for You:

As a beginner, I recommend:

1. **Start with MongoDB Atlas Web Interface** (easiest, no installation)
2. **Install MongoDB Compass** (best for development)
3. **Use API endpoints** (when you need programmatic access)

---

## 🚀 Quick Commands for PowerShell

### View Current User Info:
```powershell
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$headers = @{"Authorization" = "Bearer $($login.token)"}
$me = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -Headers $headers
$me.data | Format-List
```

### View User as JSON:
```powershell
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" -Method Post -ContentType "application/json" -Body (@{email="harish@test.com";password="test123"} | ConvertTo-Json)
$headers = @{"Authorization" = "Bearer $($login.token)"}
$me = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/me" -Method Get -Headers $headers
$me.data | ConvertTo-Json -Depth 3
```

---

## 🎨 Want Me to Create an Admin Dashboard?

I can create:
- `/api/v1/admin/users` - List all users
- `/api/v1/admin/users/:id` - Get user details
- `/api/v1/admin/stats` - Database statistics
- `/api/v1/admin/users/search` - Search users

Would you like me to create these admin endpoints? 🚀
