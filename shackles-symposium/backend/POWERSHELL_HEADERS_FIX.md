# 🔧 PowerShell HTTP Headers - Quick Fix Guide

## ❌ Common Error

```
Header name must be a valid HTTP token ["Content-Type:"]
```

**Cause:** Extra colon in header name

---

## ✅ Correct Header Format

### **Wrong ❌**
```powershell
$headers = @{
    "Content-Type:" = "application/json"      # ← WRONG: Extra colon
    "Authorization:" = "Bearer $token"        # ← WRONG: Extra colon
}
```

### **Correct ✅**
```powershell
$headers = @{
    "Content-Type" = "application/json"       # ← CORRECT: No colon
    "Authorization" = "Bearer $token"         # ← CORRECT: No colon
}
```

---

## 📋 Common Headers Reference

### **Authentication Headers**
```powershell
# Login (no auth needed)
$headers = @{
    "Content-Type" = "application/json"
}

# Authenticated requests
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}
```

### **GET Request (no body)**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri $url -Method GET -Headers $headers
```

### **POST Request (with body)**
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    key = "value"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
```

---

## 🎯 Complete Example

```powershell
# Step 1: Login
$loginBody = @{
    email = "admin@shackles.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginHeaders = @{
    "Content-Type" = "application/json"  # ← No colon!
}

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
    -Method POST `
    -Headers $loginHeaders `
    -Body $loginBody

$token = $response.token

# Step 2: Use token
$authHeaders = @{
    "Content-Type" = "application/json"   # ← No colon!
    "Authorization" = "Bearer $token"     # ← No colon!
}

$qrBody = @{
    qrData = "test data"
    eventId = "123"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/qr-scan/scan-qr" `
    -Method POST `
    -Headers $authHeaders `
    -Body $qrBody
```

---

## 🐛 Troubleshooting

### Error: "Header name must be a valid HTTP token"
✅ **Fix:** Remove colons from header names
```powershell
# Change this:
"Content-Type:" = "application/json"
# To this:
"Content-Type" = "application/json"
```

### Error: "Cannot convert value to type System.String"
✅ **Fix:** Make sure token is a string
```powershell
# Correct:
$token = $response.token.ToString()
"Authorization" = "Bearer $token"
```

### Error: "The remote server returned an error: (401) Unauthorized"
✅ **Fix:** Check token is valid and not expired
```powershell
# Print token to verify
Write-Host "Token: $token"

# Token should start with: eyJ...
```

### Error: "The remote server returned an error: (400) Bad Request"
✅ **Fix:** Check JSON body format
```powershell
# Ensure | ConvertTo-Json is used
$body = @{
    key = "value"
} | ConvertTo-Json  # ← Important!
```

---

## 📚 Additional Resources

**Header Name Rules:**
- No colons in the name
- No spaces (use hyphens)
- Case-sensitive on some servers
- Standard format: `Header-Name`

**Common Headers:**
```powershell
@{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer token"
    "Accept" = "application/json"
    "User-Agent" = "PowerShell/7.0"
    "X-Custom-Header" = "value"
}
```

---

## ✅ Quick Test

Run this to test headers are working:

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" `
        -Method GET `
        -Headers $headers
    Write-Host "✅ Headers working correctly!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

---

**Remember:** In PowerShell hashtables, use `=` not `:` for key-value pairs!

```powershell
✅ "Key" = "Value"
❌ "Key:" = "Value"
❌ "Key": "Value"
```
