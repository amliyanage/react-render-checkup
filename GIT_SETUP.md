# 🚀 Git Setup & Installation Guide

## 📋 Prerequisites

Before pushing to Git, you need:

- Git installed (`git --version`)
- Node.js 16+ installed (`node --version`)
- npm 7+ installed (`npm --version`)

## 🎯 Quick Setup & Push to Git

### Step 1: Initialize Git Repository

```bash
cd /home/sanmark/Documents/learn/react-render-checkup

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - React Render Checkup tool"
```

### Step 2: Connect to Remote Repository

```bash
# Add your remote repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/react-render-checkup.git

# Or for SSH:
git remote add origin git@github.com:YOUR_USERNAME/react-render-checkup.git

# Push to main branch
git push -u origin main
```

## 📦 Installation Instructions (For Users)

Once pushed to Git, users can install and use your tool:

### Option 1: Clone and Install Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/react-render-checkup.git
cd react-render-checkup

# Install dependencies
npm install

# Build all packages
npm run build
```

### Option 2: Install from GitHub (Direct)

```bash
# In any React project
npm install --save-dev github:YOUR_USERNAME/react-render-checkup#main
```

### Option 3: Future - Publish to NPM

```bash
# After publishing to npm
npm install --save-dev eslint-plugin-react-render-checkup
npm install --save-dev react-hook-checkup
```

## 🔧 Dependencies Overview

### Root Package Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.7",
    "@types/node": "^20.10.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "eslint": "^8.54.0",
    "rollup": "^4.53.3",
    "typescript": "^5.9.3"
  }
}
```

### ESLint Plugin Dependencies

```json
{
  "peerDependencies": {
    "eslint": "^7.0.0 || ^8.0.0"
  },
  "dependencies": {
    "@typescript-eslint/utils": "^6.13.0"
  },
  "devDependencies": {
    "@types/eslint": "^8.44.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.9.3"
  }
}
```

### React Hook Dependencies

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.7",
    "@types/node": "^20.10.0",
    "typescript": "^5.9.3"
  }
}
```

### Example App Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.54.0",
    "eslint-plugin-react-render-checkup": "file:../packages/eslint-plugin-checkup",
    "react-hook-checkup": "file:../packages/react-hook-checkup",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

## 📁 Project Structure (What Gets Pushed)

```
react-render-checkup/
├── .gitignore                          ✅ Push
├── LICENSE                             ✅ Push
├── README.md                           ✅ Push
├── QUICKSTART.md                       ✅ Push
├── TESTING.md                          ✅ Push
├── DETECTION_LOGIC.md                  ✅ Push
├── PROJECT_SUMMARY.md                  ✅ Push
├── CONTRIBUTING.md                     ✅ Push
├── GIT_SETUP.md                        ✅ Push
├── package.json                        ✅ Push
├── tsconfig.json                       ✅ Push
│
├── packages/
│   ├── eslint-plugin-checkup/
│   │   ├── src/                        ✅ Push (source code)
│   │   ├── docs/                       ✅ Push (documentation)
│   │   ├── package.json                ✅ Push
│   │   ├── tsconfig.json               ✅ Push
│   │   ├── README.md                   ✅ Push
│   │   └── dist/                       ❌ Don't push (built files)
│   │
│   └── react-hook-checkup/
│       ├── src/                        ✅ Push (source code)
│       ├── package.json                ✅ Push
│       ├── tsconfig.json               ✅ Push
│       ├── README.md                   ✅ Push
│       └── dist/                       ❌ Don't push (built files)
│
├── example/
│   ├── src/                            ✅ Push
│   ├── public/                         ✅ Push (if any)
│   ├── index.html                      ✅ Push
│   ├── package.json                    ✅ Push
│   ├── tsconfig.json                   ✅ Push
│   ├── tsconfig.node.json              ✅ Push
│   ├── vite.config.ts                  ✅ Push
│   ├── .eslintrc.cjs                   ✅ Push
│   ├── README.md                       ✅ Push
│   ├── node_modules/                   ❌ Don't push
│   └── dist/                           ❌ Don't push
│
├── node_modules/                       ❌ Don't push
└── package-lock.json                   ❌ Don't push (optional)
```

## 🔍 What to NOT Push (Already in .gitignore)

- `node_modules/` - Dependencies (users install these)
- `dist/` - Built files (users build these)
- `*.log` - Log files
- `.vite/` - Vite cache
- `.DS_Store` - Mac OS files
- `*.tsbuildinfo` - TypeScript incremental build info
- `package-lock.json` - Lock files (optional, can include if preferred)

## ✅ Pre-Push Checklist

Before pushing to Git, verify:

```bash
# 1. Check git status
git status

# 2. Verify .gitignore is working
# These should NOT appear in git status:
# - node_modules/
# - dist/
# - *.log files

# 3. Test build locally
npm install
npm run build

# 4. Run example
cd example
npm install
npm run dev
# Should work at http://localhost:5173

# 5. Check all files are added
git add .
git status

# 6. Create commit
git commit -m "feat: complete React Render Checkup implementation"

# 7. Push to remote
git push -u origin main
```

## 🌐 After Pushing to Git

Users can now:

1. **Clone your repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/react-render-checkup.git
   ```

2. **Install and build:**

   ```bash
   cd react-render-checkup
   npm install
   npm run build
   ```

3. **Run the demo:**

   ```bash
   cd example
   npm install
   npm run dev
   ```

4. **Use in their projects:**
   ```bash
   npm install --save-dev file:/path/to/react-render-checkup/packages/eslint-plugin-checkup
   npm install --save-dev file:/path/to/react-render-checkup/packages/react-hook-checkup
   ```

## 📤 Publishing to NPM (Optional - Future)

To make it even easier for users:

```bash
# 1. Login to npm
npm login

# 2. Publish ESLint plugin
cd packages/eslint-plugin-checkup
npm publish

# 3. Publish React hook
cd ../react-hook-checkup
npm publish
```

Then users can install with:

```bash
npm install --save-dev eslint-plugin-react-render-checkup react-hook-checkup
```

## 🎉 Final Git Commands

```bash
# Navigate to project
cd /home/sanmark/Documents/learn/react-render-checkup

# Ensure everything is clean
git status

# Add all changes
git add .

# Commit
git commit -m "feat: complete React Render Checkup tool with examples and documentation"

# Add remote (if not already added)
git remote add origin YOUR_GITHUB_REPO_URL

# Push
git push -u origin main
```

## 🔗 Repository Setup on GitHub

1. Go to https://github.com/new
2. Create a new repository named `react-render-checkup`
3. Don't initialize with README (you already have one)
4. Copy the repository URL
5. Use it in the `git remote add origin` command above

## 📝 Recommended Commit Message Format

```bash
# Initial commit
git commit -m "feat: initial commit - React Render Checkup tool"

# Or more detailed
git commit -m "feat: complete React Render Checkup implementation

- ESLint plugin with 3 performance detection rules
- React hook for runtime render tracking
- Interactive example application
- Comprehensive documentation
- TypeScript support throughout"
```

## 🆘 Troubleshooting

### Issue: "fatal: not a git repository"

```bash
git init
```

### Issue: "remote origin already exists"

```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Issue: "rejected - non-fast-forward"

```bash
git pull origin main --rebase
git push -u origin main
```

### Issue: Large files in commit

```bash
# Check what's being committed
git status

# If node_modules or dist appear, ensure .gitignore is correct
cat .gitignore

# Reset if needed
git reset
```

---

## ✨ You're Ready to Push!

Once you've followed these steps, your React Render Checkup tool will be on GitHub and ready for the world to use! 🚀
