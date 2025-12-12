# 📦 NPM Publishing Guide

## 🎯 How to Publish to NPM

Follow these steps to publish your packages so others can install them with `npm install`.

---

## 📋 Prerequisites

### 1. Create NPM Account (if you don't have one)

```bash
# Visit https://www.npmjs.com/signup and create an account
```

### 2. Login to NPM

```bash
npm login
# Enter your username, password, and email
```

### 3. Verify Login

```bash
npm whoami
# Should show your npm username
```

---

## 🔧 Prepare Packages for Publishing

### Step 1: Update Package Names (Make them unique)

**Edit `packages/eslint-plugin-checkup/package.json`:**

```json
{
  "name": "@YOUR_NPM_USERNAME/eslint-plugin-checkup",
  "version": "1.0.0",
  "description": "ESLint plugin for React render performance checking",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "keywords": [
    "eslint",
    "eslintplugin",
    "react",
    "performance",
    "render",
    "optimization"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/amliyanage/react-render-checkup.git",
    "directory": "packages/eslint-plugin-checkup"
  },
  "bugs": {
    "url": "https://github.com/amliyanage/react-render-checkup/issues"
  },
  "homepage": "https://github.com/amliyanage/react-render-checkup#readme"
}
```

**Edit `packages/react-hook-checkup/package.json`:**

```json
{
  "name": "@YOUR_NPM_USERNAME/react-hook-checkup",
  "version": "1.0.0",
  "description": "React hook for runtime render tracking and performance monitoring",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "keywords": [
    "react",
    "hooks",
    "performance",
    "render",
    "tracking",
    "optimization"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/amliyanage/react-render-checkup.git",
    "directory": "packages/react-hook-checkup"
  },
  "bugs": {
    "url": "https://github.com/amliyanage/react-render-checkup/issues"
  },
  "homepage": "https://github.com/amliyanage/react-render-checkup#readme",
  "peerDependencies": {
    "react": ">=16.8.0"
  }
}
```

---

## 🚀 Publishing Steps

### Step 2: Build the Packages

```bash
# From root directory
npm run build
```

### Step 3: Publish ESLint Plugin

```bash
cd packages/eslint-plugin-checkup
npm publish --access public
cd ../..
```

### Step 4: Publish React Hook

```bash
cd packages/react-hook-checkup
npm publish --access public
cd ../..
```

---

## ✅ Verify Publication

```bash
# Check if packages are live
npm view @YOUR_NPM_USERNAME/eslint-plugin-checkup
npm view @YOUR_NPM_USERNAME/react-hook-checkup
```

---

## 📥 HOW TO USE IN OTHER PROJECTS

Once published, users can install and use your packages:

### Installation

```bash
# Install both packages
npm install --save-dev @YOUR_NPM_USERNAME/eslint-plugin-checkup
npm install @YOUR_NPM_USERNAME/react-hook-checkup
```

### Usage in Projects

#### 1. ESLint Configuration

**`.eslintrc.js` or `.eslintrc.json`:**

```json
{
  "plugins": ["@YOUR_NPM_USERNAME/checkup"],
  "rules": {
    "@YOUR_NPM_USERNAME/checkup/no-inline-function-props": "warn",
    "@YOUR_NPM_USERNAME/checkup/exhaustive-deps": "warn",
    "@YOUR_NPM_USERNAME/checkup/require-stable-deps": "warn"
  }
}
```

#### 2. React Component Usage

```tsx
import { useRenderCheckup } from "@YOUR_NPM_USERNAME/react-hook-checkup";

function MyComponent({ userId, onUpdate }) {
  // Add render tracking
  useRenderCheckup("MyComponent", { userId, onUpdate });

  // Your component logic...
  return <div>...</div>;
}
```

---

## 🔄 Updating Versions

When you make changes:

```bash
# 1. Update version in package.json
# Use semantic versioning: 1.0.0 -> 1.0.1 (patch), 1.1.0 (minor), 2.0.0 (major)

# 2. Rebuild
npm run build

# 3. Publish updated version
cd packages/eslint-plugin-checkup
npm publish
cd ../..

cd packages/react-hook-checkup
npm publish
cd ../..
```

---

## 🎯 Alternative: Single Package Approach

If you want users to install just one package, you can:

### Option 1: Create a Meta Package

```bash
# Create packages/react-render-checkup/package.json
{
  "name": "react-render-checkup",
  "version": "1.0.0",
  "description": "Complete React render performance toolkit",
  "dependencies": {
    "@YOUR_NPM_USERNAME/eslint-plugin-checkup": "^1.0.0",
    "@YOUR_NPM_USERNAME/react-hook-checkup": "^1.0.0"
  }
}
```

Then users can just:

```bash
npm install react-render-checkup
```

---

## 📝 Example README for NPM

Create a simple README that will show on npmjs.com:

**packages/eslint-plugin-checkup/README.md:**

```markdown
# @YOUR_NPM_USERNAME/eslint-plugin-checkup

ESLint plugin for detecting React render performance issues.

## Installation

\`\`\`bash
npm install --save-dev @YOUR_NPM_USERNAME/eslint-plugin-checkup
\`\`\`

## Usage

\`\`\`.eslintrc.json
{
"plugins": ["@YOUR_NPM_USERNAME/checkup"],
"rules": {
"@YOUR_NPM_USERNAME/checkup/no-inline-function-props": "warn"
}
}
\`\`\`

See [full documentation](https://github.com/amliyanage/react-render-checkup)
```

---

## 🎉 You're Ready!

After following these steps, anyone can install and use your packages with:

```bash
npm install @YOUR_NPM_USERNAME/eslint-plugin-checkup @YOUR_NPM_USERNAME/react-hook-checkup
```

---

## 🔗 Useful Links

- **NPM Profile**: https://www.npmjs.com/~YOUR_NPM_USERNAME
- **Package Page**: https://www.npmjs.com/package/@YOUR_NPM_USERNAME/eslint-plugin-checkup
- **GitHub Repo**: https://github.com/amliyanage/react-render-checkup
