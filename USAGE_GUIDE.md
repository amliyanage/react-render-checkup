# 📋 COMPLETE GUIDE: Using React Render Checkup in Other Projects

## 🎯 Overview

After publishing to NPM, your packages can be used in any React project to detect and prevent performance issues.

---

## 📦 Installation

### In Any React Project

```bash
# Install both packages
npm install --save-dev eslint-plugin-react-render-checkup
npm install react-hook-checkup
```

---

## ⚙️ Configuration

### Step 1: Configure ESLint

Create or update `.eslintrc.json`:

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

Or use `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["react-render-checkup"],
  rules: {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "warn",
    "react-render-checkup/require-stable-deps": "warn",
  },
};
```

### Step 2: Use the Hook in Components

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent({ userId, onUpdate }) {
  // Add render tracking (only active in development)
  useRenderCheckup("MyComponent", { userId, onUpdate });

  // Your component logic
  return <div>Content</div>;
}
```

---

## 🎨 Complete Example

### Example Project Setup

```bash
# Create new React app
npx create-vite my-app --template react-ts
cd my-app

# Install React Render Checkup
npm install --save-dev eslint-plugin-react-render-checkup
npm install react-hook-checkup

# Install ESLint if not already installed
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configure ESLint (`.eslintrc.json`)

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-render-checkup", "@typescript-eslint"],
  "rules": {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "warn",
    "react-render-checkup/require-stable-deps": "warn"
  }
}
```

### Example Component (`src/UserProfile.tsx`)

```tsx
import { useState, useCallback } from "react";
import { useRenderCheckup } from "react-hook-checkup";

// ❌ BAD: This will trigger ESLint warnings
function BadExample({ userId }) {
  useRenderCheckup("BadExample", { userId });

  return (
    <div>
      {/* ESLint will warn: inline function prop */}
      <button onClick={() => console.log(userId)}>Click</button>
    </div>
  );
}

// ✅ GOOD: This follows best practices
function GoodExample({ userId }) {
  useRenderCheckup("GoodExample", { userId });

  // Stable callback with useCallback
  const handleClick = useCallback(() => {
    console.log(userId);
  }, [userId]);

  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

### Run and See Results

```bash
# Start dev server
npm run dev

# Run ESLint check
npx eslint src/
```

**In browser console (development mode):**

```
🔄 [UserProfile] Render #2
   Cause: Props Changed
   └─ userId: 123 -> 456
```

---

## 🔍 What You'll See

### 1. ESLint Warnings in VS Code

When you write problematic code, you'll see yellow/red squiggles with messages like:

```
⚠️ Avoid inline arrow functions as props - they create new references on every render
💡 Quick fix: Extract to useCallback
```

### 2. Console Logs During Development

When components re-render, you'll see detailed logs:

```javascript
🔄 [MyComponent] Render #3
   Cause: Props Changed
   ├─ onUpdate (function changed - needs useCallback)
   └─ Suggestion: Wrap onUpdate with useCallback in parent
```

### 3. Performance Insights

The tool helps you:

- Track render counts
- Identify unstable props
- Get automatic optimization suggestions
- Build cause trees for complex re-renders

---

## 🎯 Real-World Scenarios

### Scenario 1: Form Components

```tsx
import { useRenderCheckup } from "react-hook-checkup";
import { useCallback, useState } from "react";

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");
  useRenderCheckup("SearchForm", { onSearch, query });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Scenario 2: List Components

```tsx
import { useRenderCheckup } from "react-hook-checkup";
import { memo } from "react";

const ListItem = memo(function ListItem({ item, onDelete }) {
  useRenderCheckup("ListItem", { item, onDelete });

  return (
    <div>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});
```

### Scenario 3: Parent-Child Communication

```tsx
import { useCallback, useState } from "react";
import { useRenderCheckup } from "react-hook-checkup";

function Parent() {
  const [count, setCount] = useState(0);
  useRenderCheckup("Parent", { count });

  // ✅ Stable callback - won't cause child re-renders
  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return <Child onIncrement={handleIncrement} />;
}

function Child({ onIncrement }) {
  useRenderCheckup("Child", { onIncrement });
  return <button onClick={onIncrement}>+</button>;
}
```

---

## 🛠️ Development vs Production

**Important:** The runtime hook (`useRenderCheckup`) only runs in development:

```typescript
// Automatically disabled in production
if (process.env.NODE_ENV !== "development") {
  return; // No overhead in production
}
```

**ESLint** runs during development/CI, catching issues before they reach production.

---

## 📊 Integration with CI/CD

### Add ESLint Check to CI

In your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint src/",
    "test": "npm run lint && vitest"
  }
}
```

In your CI config (e.g., `.github/workflows/test.yml`):

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint # ← Checks performance issues
      - run: npm test
```

---

## 🎓 Best Practices

### ✅ DO:

- Use `useRenderCheckup` in components you want to monitor
- Run ESLint before committing code
- Address warnings during development
- Use `useCallback` and `useMemo` when suggested

### ❌ DON'T:

- Don't over-optimize - only fix real issues
- Don't use in production builds (hook auto-disables)
- Don't ignore ESLint warnings without understanding them

---

## 🔧 Troubleshooting

### ESLint Not Working?

```bash
# Make sure ESLint is installed
npm install --save-dev eslint

# Check ESLint config
npx eslint --print-config src/App.tsx
```

### Hook Not Logging?

```bash
# Make sure you're in development mode
NODE_ENV=development npm run dev
```

### TypeScript Errors?

```bash
# Install type definitions
npm install --save-dev @types/node
```

---

## 📚 Learn More

- **Full Documentation**: [GitHub README](https://github.com/amliyanage/react-render-checkup)
- **Detection Logic**: See `DETECTION_LOGIC.md` in repo
- **Testing Guide**: See `TESTING.md` in repo

---

## 🎉 You're All Set!

Now you know how to use React Render Checkup in any React project to catch performance issues early and build faster apps! 🚀
