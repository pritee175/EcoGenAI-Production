# 📤 Push to GitHub Guide

## Quick Push (Automated)

Run this script to push everything automatically:

```powershell
.\push-to-github.ps1
```

This will:
1. Initialize git (if needed)
2. Add remote repository
3. Add all files
4. Create commit
5. Push to GitHub

---

## Manual Push (Step by Step)

### Step 1: Initialize Git (if not already done)

```powershell
cd path\to\your\project
git init
```

### Step 2: Add Remote Repository

```powershell
git remote add origin https://github.com/pritee175/EcoGenAI.git
```

Or if remote already exists:
```powershell
git remote set-url origin https://github.com/pritee175/EcoGenAI.git
```

### Step 3: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Check What Will Be Pushed

```powershell
git status
```

### Step 5: Add All Files

```powershell
git add .
```

### Step 6: Create Commit

```powershell
git commit -m "feat: Complete EcoGenAI platform with Firebase auth"
```

### Step 7: Push to GitHub

```powershell
git push -u origin main
```

Or if using master branch:
```powershell
git push -u origin master
```

---

## ⚠️ Important: Sensitive Files

Before pushing, make sure these files are in `.gitignore`:

### Already in .gitignore ✅
- `node_modules/`
- `.next/`
- `.env.local`
- `.env`
- `*.pyc`
- `__pycache__/`
- `.vscode/`

### Check These Files

**final_frontened/.env.local** - Contains Firebase credentials
- ✅ Should be in .gitignore
- ✅ Will NOT be pushed

**EcoGenAI/backend/.env** - Contains backend secrets
- ✅ Should be in .gitignore
- ✅ Will NOT be pushed

---

## 🔒 Security Checklist

Before pushing, verify:

- [ ] `.env.local` is in `.gitignore`
- [ ] `.env` is in `.gitignore`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] Firebase credentials only in `.env.local`
- [ ] `.gitignore` is properly configured

---

## 📁 What Will Be Pushed

### EcoGenAI Folder
- ✅ Backend (FastAPI)
- ✅ Frontend (React/Next.js - old version)
- ✅ Documentation
- ✅ Scripts
- ❌ `.env` (ignored)
- ❌ `__pycache__/` (ignored)

### final_frontened Folder
- ✅ App (Next.js with Firebase)
- ✅ Components
- ✅ Lib (Firebase config)
- ✅ Documentation
- ✅ Scripts
- ❌ `.env.local` (ignored)
- ❌ `node_modules/` (ignored)
- ❌ `.next/` (ignored)

### eco-gen-ai-enterprise-dashboard Folder
- ✅ All files (if present)

---

## 🐛 Troubleshooting

### Error: "remote origin already exists"

```powershell
git remote set-url origin https://github.com/pritee175/EcoGenAI.git
```

### Error: "failed to push some refs"

The repository might have files you don't have locally. Pull first:

```powershell
git pull origin main --allow-unrelated-histories
```

Then push:

```powershell
git push -u origin main
```

### Error: "repository not found"

Make sure the repository exists on GitHub:
1. Go to: https://github.com/pritee175/EcoGenAI
2. If it doesn't exist, create it on GitHub first
3. Then run the push command again

### Error: "authentication failed"

You need to authenticate with GitHub:

**Option 1: Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`
4. Copy the token
5. Use it as password when pushing

**Option 2: GitHub CLI**
```powershell
gh auth login
```

**Option 3: SSH Key**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub
# Copy the public key and add it to GitHub settings
```

---

## 📊 Repository Structure

After pushing, your GitHub repo will have:

```
EcoGenAI/
├── EcoGenAI/                    # Main backend + old frontend
│   ├── backend/                 # FastAPI backend
│   ├── frontend/                # Old React frontend
│   └── *.md                     # Documentation
├── final_frontened/             # New Next.js frontend with Firebase
│   ├── app/                     # Pages and layouts
│   ├── components/              # React components
│   ├── lib/                     # Firebase config
│   └── *.md                     # Documentation
├── eco-gen-ai-enterprise-dashboard/  # Alternative frontend
├── .gitignore                   # Git ignore rules
├── push-to-github.ps1          # Push script
└── GITHUB-PUSH-GUIDE.md        # This file
```

---

## 🎯 After Pushing

### View Your Repository
https://github.com/pritee175/EcoGenAI

### Clone on Another Machine
```powershell
git clone https://github.com/pritee175/EcoGenAI.git
cd EcoGenAI
```

### Setup on New Machine

**Backend:**
```powershell
cd EcoGenAI/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
python -m uvicorn app.main:app --reload
```

**Frontend:**
```powershell
cd final_frontened
npm install
cp .env.local.example .env.local
# Edit .env.local with Firebase credentials
npm run dev
```

---

## 📝 Commit Message Guidelines

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
```
feat: Add Firebase authentication
fix: Resolve Vanta.js loading issue
docs: Update README with setup instructions
style: Apply EcoGenAI branding
```

---

## 🔄 Future Updates

To push updates later:

```powershell
# Make your changes
git add .
git commit -m "feat: Your update description"
git push
```

---

## ✅ Success!

Once pushed, you can:
- ✅ View code on GitHub
- ✅ Share with team
- ✅ Clone on other machines
- ✅ Track changes
- ✅ Collaborate with others
- ✅ Deploy to hosting services

---

**Ready to push? Run:**
```powershell
.\push-to-github.ps1
```
