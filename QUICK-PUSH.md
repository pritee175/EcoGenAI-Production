# 🚀 Quick Push to GitHub

## ⚠️ IMPORTANT SECURITY NOTE

**You shared your password in chat - please change it immediately!**

1. Go to: https://github.com/settings/security
2. Click "Change password"
3. Use a strong, unique password
4. Never share it again

---

## 📝 What You Need

GitHub requires a **Personal Access Token** (not password) for git operations.

### Get Your Token (2 minutes):

1. **Go to:** https://github.com/settings/tokens
2. **Click:** "Generate new token (classic)"
3. **Name:** EcoGenAI
4. **Select:** ☑️ repo (full control of private repositories)
5. **Click:** "Generate token"
6. **Copy the token** - it looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`

⚠️ **Save this token** - you won't see it again!

---

## 🎯 Push Your Code (3 Steps)

### Step 1: Open PowerShell
- Press `Windows + R`
- Type: `powershell`
- Press Enter

### Step 2: Navigate to Parent Directory
```powershell
# Go to the folder that contains EcoGenAI, final_frontened, etc.
cd E:\
```

### Step 3: Run the Script
```powershell
.\EcoGenAI\secure-push.ps1
```

### Step 4: Enter Token When Asked
- **Username:** pritee175
- **Password:** Paste your Personal Access Token (ghp_xxx...)

---

## ✅ Done!

Your code will be at: **https://github.com/pritee175/EcoGenAI**

---

## 🐛 If Repository Doesn't Exist

1. Go to: https://github.com/new
2. Repository name: `EcoGenAI`
3. Description: "ESG Intelligence Platform"
4. **Don't** check "Initialize with README"
5. Click "Create repository"
6. Run the script again

---

## 📞 Need Help?

**Token not working?**
- Make sure you selected `repo` scope
- Generate a new token
- Copy it completely (starts with `ghp_`)

**Push failed?**
- Check repository exists
- Verify token has correct permissions
- Try again with new token

---

**Total time: ~5 minutes**
