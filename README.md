# React Render Checkup 🔍

A lightweight, proactive development tool that helps you catch React performance issues **before** they become problems. Unlike traditional profiling tools that require you to detect issues first, React Render Checkup proactively flags potential re-render problems during development through both static analysis (ESLint) and runtime detection (React hooks).

## 🎯 The Problem

React performance issues often stem from unnecessary re-renders caused by:

- Inline arrow functions and object literals passed as props
- Unstable dependencies in hooks
- Missing or incorrect dependency arrays
- Props that change references unnecessarily

These issues are usually discovered late in development or in production when performance problems surface.

## 💡 The Solution

React Render Checkup provides two complementary tools:

1. **ESLint Plugin** - Catches issues during development through static analysis
2. **React Hook** - Provides runtime tracking with visual "cause trees" to trace render issues to their source

## 📦 Packages

This monorepo contains two packages:

- **`eslint-plugin-react-render-checkup`** - ESLint rules for static analysis
- **`react-hook-checkup`** - Runtime hooks for render tracking

## 🚀 Quick Start

### Installing ESLint Plugin

```bash
npm install --save-dev eslint-plugin-react-render-checkup
```

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["react-render-checkup"],
  extends: ["plugin:react-render-checkup/recommended"],
  // Or configure individual rules:
  rules: {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "error",
    "react-render-checkup/require-stable-deps": "warn",
  },
};
```

### Installing React Hook

```bash
npm install --save-dev react-hook-checkup
```

Use in your components:

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent({ data, onUpdate }) {
  useRenderCheckup("MyComponent", { data, onUpdate });

  // Your component logic
  return <div>...</div>;
}
```

## 📖 Features

### 1. Lint Integration

Statically analyze code for common performance footguns:

```tsx
// ❌ Bad - Creates new function on every render
<Button onClick={() => handleClick()} />;

// ✅ Good - Stable reference
const handleButtonClick = useCallback(() => handleClick(), []);
<Button onClick={handleButtonClick} />;
```

**ESLint Rules:**

- **`no-inline-function-props`** - Prevents inline arrow functions, objects, and arrays as props
- **`exhaustive-deps`** - Enhanced dependency checking for React hooks
- **`require-stable-deps`** - Suggests memoization for unstable dependencies

### 2. Dependency Array Check

Ensures dependencies are stable and exhaustive:

```tsx
// ❌ Warning: unstable dependency
function MyComponent() {
  const config = { api: "/api/data" }; // New object every render

  useEffect(() => {
    fetchData(config);
  }, [config]); // This will cause infinite re-renders!
}

// ✅ Good
function MyComponent() {
  const config = useMemo(() => ({ api: "/api/data" }), []);

  useEffect(() => {
    fetchData(config);
  }, [config]);
}
```

### 3. "Cause Tree" in DevTools

Instead of just listing changed props, get a visual tree showing the root cause:

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function ChildComponent({ data, onUpdate }) {
  useRenderCheckup(
    "ChildComponent",
    { data, onUpdate },
    {
      logToConsole: true,
      trackCauseTree: true,
    }
  );

  return <div>{data.name}</div>;
}
```

**Console output:**

```
🔄 ChildComponent rendered (#3)
  Changed props: onUpdate

  💡 Suggestions:
  - useCallback: Function prop "onUpdate" creates new reference on each render

  Cause tree: {
    componentName: "ChildComponent",
    propName: "onUpdate",
    reason: "Unstable function passed as prop",
    parent: null
  }
```

### 4. Auto-Memoization Suggestions

Get actionable suggestions on where to optimize:

```tsx
// Component with performance issues
function ParentComponent() {
  const [count, setCount] = useState(0);

  // This causes ChildComponent to re-render unnecessarily
  const config = { theme: "dark" };

  return <ChildComponent config={config} />;
}
```

**React Render Checkup will suggest:**

```
💡 Suggestion: Object prop "config" creates new reference on each render
   Consider using useMemo:

   const config = useMemo(() => ({ theme: 'dark' }), []);
```

## 🔧 API Reference

### React Hook API

#### `useRenderCheckup(componentName, props, options)`

Tracks component renders and detects performance issues.

**Parameters:**

- `componentName` (string) - Name of the component
- `props` (object) - Current props to track
- `options` (object) - Configuration options

**Options:**

```typescript
interface CheckupOptions {
  enabled?: boolean; // Enable/disable tracking (default: true in dev)
  logToConsole?: boolean; // Log to console (default: true)
  trackCauseTree?: boolean; // Build cause tree (default: true)
  includeValues?: boolean; // Include prop values in logs (default: false)
  onRender?: (info: RenderInfo) => void; // Custom callback
}
```

#### `withRenderCheckup(Component, options)`

HOC to automatically track renders:

```tsx
const TrackedComponent = withRenderCheckup(MyComponent, {
  logToConsole: true,
});
```

#### `getRenderStats(componentName)`

Get statistics for a component:

```tsx
const stats = getRenderStats("MyComponent");
// {
//   totalRenders: 10,
//   unnecessaryRenders: 3,
//   averageChangedProps: 1.5
// }
```

#### Other utilities:

- `getTrackedComponents()` - Get list of all tracked components
- `clearCheckupData()` - Clear all tracking data
- `exportCheckupData()` - Export data as JSON

### ESLint Plugin Rules

#### `react-render-checkup/no-inline-function-props`

Disallows inline functions, objects, and arrays as props.

**Options:**

```javascript
{
  "react-render-checkup/no-inline-function-props": ["warn", {
    "allowedProps": ["style", "className", "key"],
    "checkAllComponents": false
  }]
}
```

#### `react-render-checkup/exhaustive-deps`

Ensures hook dependencies are complete and necessary.

```javascript
{
  "react-render-checkup/exhaustive-deps": "error"
}
```

#### `react-render-checkup/require-stable-deps`

Suggests memoization for unstable dependencies.

```javascript
{
  "react-render-checkup/require-stable-deps": "warn"
}
```

## 📊 Example Usage

```tsx
import React, { useState, useCallback, useMemo } from "react";
import { useRenderCheckup } from "react-hook-checkup";

function TodoList({ initialTodos }) {
  useRenderCheckup("TodoList", { initialTodos });

  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("all");

  // ✅ Memoized to prevent unnecessary re-renders
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "active") return !todo.completed;
      return true;
    });
  }, [todos, filter]);

  // ✅ Stable callback reference
  const handleToggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <div>
      <FilterButtons onFilterChange={setFilter} />
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
      ))}
    </div>
  );
}

function TodoItem({ todo, onToggle }) {
  useRenderCheckup("TodoItem", { todo, onToggle });

  return <div onClick={() => onToggle(todo.id)}>{todo.text}</div>;
}
```

## 🎨 Console Output Examples

### Healthy Render

```
🔄 TodoList rendered (#2)
  Changed props: initialTodos
  ✓ Component rendered due to legitimate prop change
```

### Unnecessary Render

```
🔄 TodoItem rendered (#5)
  ⚠️ Unnecessary render - no props changed

  💡 Suggestions:
  - React.memo: Component re-rendered without prop changes
```

### Unstable Props

```
🔄 TodoItem rendered (#3)
  Changed props: onToggle

  💡 Suggestions:
  - useCallback: Function prop "onToggle" creates new reference on each render

  Cause tree: {
    componentName: "TodoItem",
    propName: "onToggle",
    reason: "Unstable function passed as prop"
  }
```

## 🔬 Advanced Usage

### Custom Render Callback

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent(props) {
  useRenderCheckup("MyComponent", props, {
    onRender: (info) => {
      // Send to analytics
      if (info.changedProps.length === 0) {
        trackEvent("unnecessary_render", {
          component: info.componentName,
          renderCount: info.renderCount,
        });
      }
    },
  });

  return <div>...</div>;
}
```

### Exporting Data for Analysis

```tsx
import { exportCheckupData } from "react-hook-checkup";

// Export after testing session
const data = exportCheckupData();
console.log(data); // Full render history as JSON
```

## 🚫 Development Only

Both packages are designed for development use only. The React hook automatically disables in production (`NODE_ENV === 'production'`).

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT

## 🙏 Acknowledgments

Inspired by:

- [why-did-you-render](https://github.com/welldone-software/why-did-you-render)
- React DevTools Profiler
- The upcoming React Compiler

---

**Built with ❤️ for React developers who care about performance**
