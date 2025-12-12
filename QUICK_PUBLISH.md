# 🚀 Quick NPM Publish Commands

## Step-by-Step Publishing Guide

### 1️⃣ Login to NPM (One-time setup)

```bash
npm login
# Enter your username: YOUR_NPM_USERNAME
# Enter your password: ****
# Enter your email: your@email.com
```

### 2️⃣ Build Packages

```bash
# From project root
cd /home/sanmark/Documents/learn/react-render-checkup
npm run build
```

### 3️⃣ Publish ESLint Plugin

```bash
cd packages/eslint-plugin-checkup
npm publish --access public
cd ../..
```

### 4️⃣ Publish React Hook

```bash
cd packages/react-hook-checkup
npm publish --access public
cd ../..
```

### 5️⃣ Verify Publication

```bash
# Check packages on NPM
npm view eslint-plugin-react-render-checkup
npm view react-hook-checkup
```

---

## 📥 HOW USERS WILL INSTALL

After publishing, users can install with:

```bash
npm install --save-dev eslint-plugin-react-render-checkup
npm install react-hook-checkup
```

---

## 🎯 HOW TO USE IN OTHER PROJECTS

### ESLint Configuration

Create or edit `.eslintrc.json`:

```json
{
  "plugins": ["react-render-checkup"],
  "rules": {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "warn",
    "react-render-checkup/require-stable-deps": "warn"
  }
}
```

### React Component Usage

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent({ userId, onUpdate }) {
  // Track renders
  useRenderCheckup("MyComponent", { userId, onUpdate });

  return <div>My Component</div>;
}
```

---

## 🔄 Update & Re-publish Later

When you make changes:

```bash
# 1. Update version in package.json (e.g., 1.0.0 -> 1.0.1)
# 2. Rebuild
npm run build

# 3. Publish
cd packages/eslint-plugin-checkup
npm publish
cd ../..

cd packages/react-hook-checkup
npm publish
cd ../..
```

---

## 📦 Package Names

- **ESLint Plugin**: `eslint-plugin-react-render-checkup`
- **React Hook**: `react-hook-checkup`

---

## ✅ Checklist Before Publishing

- [ ] NPM account created at npmjs.com
- [ ] Logged in with `npm login`
- [ ] Built packages with `npm run build`
- [ ] Verified both `dist` folders exist
- [ ] Ready to run `npm publish --access public`

---

## 🎉 After Publishing

Your packages will be available at:

- https://www.npmjs.com/package/eslint-plugin-react-render-checkup
- https://www.npmjs.com/package/react-hook-checkup

GitHub badge you can add to README:

```markdown
[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-render-checkup.svg)](https://www.npmjs.com/package/eslint-plugin-react-render-checkup)
[![npm version](https://img.shields.io/npm/v/react-hook-checkup.svg)](https://www.npmjs.com/package/react-hook-checkup)
```
