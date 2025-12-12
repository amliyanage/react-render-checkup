# Testing React Render Checkup

## 🧪 How to Test

### Method 1: Interactive Demo (Recommended!)

The easiest way to see the tool in action:

```bash
# 1. Build the packages (if not already done)
cd /home/sanmark/Documents/learn/react-render-checkup
npm run build

# 2. Install example dependencies
cd example
npm install

# 3. Start the dev server
npx vite
```

**Then:**

1. Open your browser to **http://localhost:5173/**
2. **Open the browser console** (Press F12 or Right-click → Inspect → Console)
3. Click on the different example buttons
4. Watch the console for colorful render notifications! 🎨

**What you'll see:**

- 🟢 Green messages for normal renders
- 🟠 Orange warnings for unnecessary renders
- 💡 Blue suggestions for optimizations
- 📊 Cause trees showing why components rendered

---

### Method 2: Test in Your Own Project

Create a simple test file:

```bash
# Create a test React app (if you don't have one)
cd /tmp
npx create-vite my-test-app --template react-ts
cd my-test-app
npm install

# Install the packages
npm install --save-dev file:/home/sanmark/Documents/learn/react-render-checkup/packages/react-hook-checkup
npm install --save-dev file:/home/sanmark/Documents/learn/react-render-checkup/packages/eslint-plugin-checkup
```

Create `src/TestComponent.tsx`:

```tsx
import { useState, useCallback } from "react";
import { useRenderCheckup } from "react-hook-checkup";

// Bad Example - will show warnings
function BadChild({ onClick }: { onClick: () => void }) {
  useRenderCheckup("BadChild", { onClick });
  return <button onClick={onClick}>Click me</button>;
}

// Good Example - optimized
const GoodChild = React.memo(({ onClick }: { onClick: () => void }) => {
  useRenderCheckup("GoodChild", { onClick });
  return <button onClick={onClick}>Click me</button>;
});

function TestComponent() {
  const [count, setCount] = useState(0);

  // Bad: Creates new function every render
  const handleBadClick = () => {
    console.log("Bad click");
  };

  // Good: Stable function reference
  const handleGoodClick = useCallback(() => {
    console.log("Good click");
  }, []);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>

      <h2>Bad Example (check console):</h2>
      <BadChild onClick={handleBadClick} />

      <h2>Good Example:</h2>
      <GoodChild onClick={handleGoodClick} />
    </div>
  );
}

export default TestComponent;
```

Run the app and check the console!

---

### Method 3: Test ESLint Rules

Create a test file with intentional problems:

```bash
cd /home/sanmark/Documents/learn/react-render-checkup
mkdir -p test-files
```

Create `test-files/test-eslint.tsx`:

```tsx
import { useState, useEffect, useMemo } from "react";

// This file intentionally has performance issues to test ESLint rules

function BadComponent({ data }: { data: any }) {
  const [count, setCount] = useState(0);

  // ❌ Bad: inline function
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>

      {/* ❌ Bad: inline object */}
      <Child config={{ theme: "dark" }} />

      {/* ❌ Bad: inline array */}
      <List items={[1, 2, 3]} />
    </div>
  );
}

function ProblematicHooks() {
  const [userId, setUserId] = useState(1);

  // ❌ Bad: missing dependency
  useEffect(() => {
    fetchUser(userId);
  }, []); // userId is missing!

  // ❌ Bad: unstable dependency
  const config = { api: "/api" };
  useEffect(() => {
    fetch(config.api);
  }, [config]); // config changes every render!

  // ❌ Bad: unstable dependency in useMemo
  const options = { method: "GET" };
  const result = useMemo(() => {
    return processOptions(options);
  }, [options]); // options is recreated every render!
}
```

Now run ESLint:

```bash
cd /home/sanmark/Documents/learn/react-render-checkup

# Create .eslintrc.js in test-files
cat > test-files/.eslintrc.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['react-render-checkup'],
  rules: {
    'react-render-checkup/no-inline-function-props': 'warn',
    'react-render-checkup/exhaustive-deps': 'error',
    'react-render-checkup/require-stable-deps': 'warn',
  },
};
EOF

# Run ESLint
npx eslint test-files/test-eslint.tsx
```

You should see warnings and errors pointing out the performance issues!

---

### Method 4: Unit Test the Hook Functionality

Create `test-files/test-hook.tsx`:

```tsx
import {
  useRenderCheckup,
  getRenderStats,
  clearCheckupData,
} from "react-hook-checkup";
import { useState } from "react";

function TestHookComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Test");

  useRenderCheckup(
    "TestHookComponent",
    { count, name },
    {
      logToConsole: true,
      trackCauseTree: true,
      includeValues: true,
    }
  );

  return (
    <div>
      <h1>
        Count: {count}, Name: {name}
      </h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment Count</button>
      <button onClick={() => setName("Updated")}>Change Name</button>
      <button
        onClick={() => {
          const stats = getRenderStats("TestHookComponent");
          console.log("Stats:", stats);
        }}
      >
        Show Stats
      </button>
      <button onClick={clearCheckupData}>Clear Data</button>
    </div>
  );
}
```

**Test scenarios:**

1. Click "Increment Count" - should show count changed
2. Click "Change Name" - should show name changed
3. Click buttons multiple times
4. Click "Show Stats" - should display render statistics
5. Check console for detailed information

---

### Method 5: Test API Functions

Open browser console while running the demo and try:

```javascript
// Get all tracked components
window.__CHECKUP_API__ = require("react-hook-checkup");
const components = window.__CHECKUP_API__.getTrackedComponents();
console.log("Tracked components:", components);

// Get stats for a specific component
const stats = window.__CHECKUP_API__.getRenderStats("TodoItem");
console.log("TodoItem stats:", stats);

// Export all data
const data = window.__CHECKUP_API__.exportCheckupData();
console.log("All data:", data);

// Clear data
window.__CHECKUP_API__.clearCheckupData();
```

---

## ✅ What to Look For

### Runtime Hook Testing Checklist:

- [ ] Console shows render notifications when components update
- [ ] Changed props are correctly identified
- [ ] Unnecessary renders (no props changed) are flagged with warnings
- [ ] Suggestions appear for unstable props (functions, objects, arrays)
- [ ] Cause trees show the chain of render causes
- [ ] Color coding works (green for normal, orange for warnings)
- [ ] Stats API returns correct render counts
- [ ] Export function generates valid JSON

### ESLint Plugin Testing Checklist:

- [ ] Inline functions in props trigger warnings
- [ ] Inline objects in props trigger warnings
- [ ] Inline arrays in props trigger warnings
- [ ] Missing dependencies in useEffect are caught
- [ ] Unstable dependencies are flagged
- [ ] Unnecessary dependencies are detected
- [ ] Suggestions mention the correct hook (useCallback/useMemo)

---

## 🐛 Common Test Issues

### Issue: Console is empty

**Solution:** Make sure you've opened the browser console (F12) and are interacting with the components.

### Issue: No ESLint warnings

**Solution:**

1. Check that the plugin is properly configured in `.eslintrc.js`
2. Run `npx eslint --debug test-file.tsx` to see what's happening
3. Make sure the rules are enabled

### Issue: "Cannot find module" errors

**Solution:**

1. Run `npm run build` in the root directory
2. Check that `dist/` folders exist in both packages
3. Reinstall dependencies: `cd example && npm install`

### Issue: Demo app won't start

**Solution:**

```bash
cd example
rm -rf node_modules package-lock.json
npm install
npx vite
```

---

## 📊 Success Criteria

Your testing is successful when you can:

1. ✅ See colorful console output when components render
2. ✅ Identify unnecessary renders in the demo "Bad" examples
3. ✅ See suggestions for useCallback/useMemo in console
4. ✅ Get ESLint warnings for performance anti-patterns
5. ✅ Use the stats API to get render information
6. ✅ Compare "Bad" vs "Good" examples and see the difference

---

## 🎯 Quick Test Commands

```bash
# Full test workflow
cd /home/sanmark/Documents/learn/react-render-checkup

# 1. Build packages
npm run build

# 2. Start demo
cd example && npx vite

# 3. In another terminal - test ESLint
cd ..
npx eslint example/src/App.tsx

# 4. Open browser to http://localhost:5173
# 5. Open console (F12)
# 6. Click around and watch the magic! ✨
```

---

## 📹 Demo Flow

1. **Start demo:** `cd example && npx vite`
2. **Open:** http://localhost:5173
3. **Open console:** F12
4. **Test Bad Example:** Click "Show Bad Example" → Toggle todos → See warnings
5. **Test Good Example:** Click "Show Good Example" → Toggle todos → See optimized renders
6. **Compare:** Notice how "Good" has fewer unnecessary renders
7. **Read suggestions:** Console will tell you exactly what to fix

---

## 🎉 You're Testing It Right When...

You see output like this in the console:

```
🔄 BadTodoItem rendered (#5)
  Changed props: onToggle

  💡 Suggestions:
  - useCallback: Function prop "onToggle" creates new reference on each render

  Cause tree: {
    componentName: "BadTodoItem",
    propName: "onToggle",
    reason: "Unstable function passed as prop"
  }
```

Happy testing! 🚀
