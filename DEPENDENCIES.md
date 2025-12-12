# 📦 Complete Dependencies Reference

## Overview

This document lists ALL dependencies used across the React Render Checkup monorepo.

---

## 🎯 Root Dependencies (`/package.json`)

### Production Dependencies

```json
{
  "react": "^19.2.1" // React library (for reference)
}
```

### Development Dependencies

```json
{
  "@types/react": "^19.2.7", // TypeScript types for React
  "@types/node": "^20.10.0", // TypeScript types for Node.js
  "@typescript-eslint/parser": "^6.13.0", // TypeScript parser for ESLint
  "@typescript-eslint/eslint-plugin": "^6.13.0", // TypeScript ESLint rules
  "eslint": "^8.54.0", // ESLint core
  "rollup": "^4.53.3", // Build tool (optional)
  "typescript": "^5.9.3" // TypeScript compiler
}
```

**Total:** 1 prod + 7 dev = **8 dependencies**

---

## 🔌 ESLint Plugin (`/packages/eslint-plugin-checkup/package.json`)

### Peer Dependencies (Required by users)

```json
{
  "eslint": "^7.0.0 || ^8.0.0" // ESLint must be installed by user
}
```

### Production Dependencies

```json
{
  "@typescript-eslint/utils": "^6.13.0" // Utilities for creating TypeScript ESLint rules
}
```

### Development Dependencies

```json
{
  "@types/eslint": "^8.44.0", // TypeScript types for ESLint
  "@types/node": "^20.10.0", // TypeScript types for Node.js
  "typescript": "^5.9.3" // TypeScript compiler
}
```

**Total:** 1 peer + 1 prod + 3 dev = **5 dependencies**

---

## ⚛️ React Hook (`/packages/react-hook-checkup/package.json`)

### Peer Dependencies (Required by users)

```json
{
  "react": "^18.0.0 || ^19.0.0" // React must be installed by user
}
```

### Production Dependencies

```json
{} // No production dependencies!
```

### Development Dependencies

```json
{
  "@types/react": "^19.2.7", // TypeScript types for React
  "@types/node": "^20.10.0", // TypeScript types for Node.js
  "typescript": "^5.9.3" // TypeScript compiler
}
```

**Total:** 1 peer + 0 prod + 3 dev = **4 dependencies**

---

## 🎨 Example App (`/example/package.json`)

### Production Dependencies

```json
{
  "react": "^18.2.0", // React library
  "react-dom": "^18.2.0" // React DOM renderer
}
```

### Development Dependencies

```json
{
  "@types/react": "^18.2.0", // TypeScript types for React
  "@types/react-dom": "^18.2.0", // TypeScript types for React DOM
  "@vitejs/plugin-react": "^4.2.0", // Vite plugin for React
  "eslint": "^8.54.0", // ESLint core
  "eslint-plugin-react-render-checkup": "file:../packages/eslint-plugin-checkup", // Local package
  "react-hook-checkup": "file:../packages/react-hook-checkup", // Local package
  "typescript": "^5.3.0", // TypeScript compiler
  "vite": "^5.0.0" // Vite build tool
}
```

**Total:** 2 prod + 8 dev = **10 dependencies**

---

## 📊 Summary by Category

### By Package Type

| Package       | Peer  | Production | Development | Total  |
| ------------- | ----- | ---------- | ----------- | ------ |
| Root          | 0     | 1          | 7           | 8      |
| ESLint Plugin | 1     | 1          | 3           | 5      |
| React Hook    | 1     | 0          | 3           | 4      |
| Example App   | 0     | 2          | 8           | 10     |
| **TOTAL**     | **2** | **4**      | **21**      | **27** |

### By Dependency Type

- **TypeScript Related:** 7 packages
- **React Related:** 4 packages
- **ESLint Related:** 4 packages
- **Build Tools:** 3 packages
- **Type Definitions:** 4 packages
- **Utilities:** 1 package

---

## 🔍 Dependency Explanations

### Core Dependencies

| Dependency   | Why Needed             | Where Used              |
| ------------ | ---------------------- | ----------------------- |
| `react`      | Core React library     | All packages (peer/dev) |
| `typescript` | TypeScript compilation | All packages            |
| `eslint`     | Linting framework      | ESLint plugin + example |

### TypeScript Types

| Dependency         | Purpose                        |
| ------------------ | ------------------------------ |
| `@types/react`     | Type definitions for React     |
| `@types/react-dom` | Type definitions for React DOM |
| `@types/node`      | Type definitions for Node.js   |
| `@types/eslint`    | Type definitions for ESLint    |

### ESLint Ecosystem

| Dependency                         | Purpose                             |
| ---------------------------------- | ----------------------------------- |
| `@typescript-eslint/parser`        | Parse TypeScript for ESLint         |
| `@typescript-eslint/eslint-plugin` | TypeScript ESLint rules             |
| `@typescript-eslint/utils`         | Utilities for creating ESLint rules |

### Build Tools

| Dependency             | Purpose                             |
| ---------------------- | ----------------------------------- |
| `vite`                 | Fast development server and bundler |
| `@vitejs/plugin-react` | Vite plugin for React support       |
| `rollup`               | Module bundler (optional)           |

---

## 💾 Installation Commands

### Full Monorepo Install

```bash
cd /home/sanmark/Documents/learn/react-render-checkup
npm install                    # Installs root dependencies
npm run build                  # Builds both packages
cd example && npm install      # Installs example dependencies
```

### Individual Package Install

```bash
# ESLint Plugin
cd packages/eslint-plugin-checkup
npm install

# React Hook
cd packages/react-hook-checkup
npm install

# Example
cd example
npm install
```

---

## 🎯 For End Users (After Git Push)

When users install your packages, they need:

### Minimum Requirements

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "eslint": "^7.0.0 || ^8.0.0"
  }
}
```

### Recommended Setup

```bash
npm install --save-dev eslint-plugin-react-render-checkup
npm install --save-dev react-hook-checkup
npm install --save-dev eslint @typescript-eslint/parser
```

---

## 📦 Package Sizes (Approximate)

- **eslint-plugin-checkup:** ~50KB (compiled)
- **react-hook-checkup:** ~30KB (compiled)
- **Total installed:** ~80KB + dependencies

---

## 🔄 Dependency Update Strategy

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm update typescript

# Update in all workspaces
npm update --workspaces
```

---

## ⚠️ Important Notes

1. **Peer Dependencies** must be installed by the end user
2. **Dev Dependencies** are only for development, not bundled
3. **File references** (`file:../`) work in monorepo but not after npm publish
4. **TypeScript** version should stay consistent across packages
5. **React** versions should be compatible (18.x or 19.x)

---

## 🎓 Dependency Philosophy

- **Minimal production dependencies** - Keep bundle size small
- **Use peer dependencies** - Let users control versions
- **Dev dependencies for tooling** - Build tools not included in output
- **Type-safe everything** - TypeScript throughout
- **No duplicate dependencies** - Workspace dedupe

---

## ✅ Dependency Checklist for Git Push

- [ ] All `package.json` files are complete
- [ ] No `node_modules` in commit
- [ ] No `dist` folders in commit
- [ ] `.gitignore` properly configured
- [ ] All dependencies have correct versions
- [ ] Peer dependencies documented
- [ ] Example app dependencies reference local packages

---

This completes the dependency documentation! 🎉
