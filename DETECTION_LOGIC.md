# 🔍 React Render Checkup - Detection Logic Explained

## How It Works: The Complete Logic

React Render Checkup uses **reference comparison** and **render tracking** to detect performance issues. Here's the complete breakdown:

---

## 1. 🎯 The Core Detection Algorithm

### Step-by-Step Process:

```
Component Renders
    ↓
useRenderCheckup Hook Fires
    ↓
useEffect Runs (after render)
    ↓
Compare Current Props vs Previous Props
    ↓
Detect Changes Using Reference Equality (===)
    ↓
Classify Props as Stable or Unstable
    ↓
Generate Suggestions
    ↓
Log to Console / Call Callback
```

---

## 2. 🔬 Reference Comparison Logic

### The Key Principle: JavaScript Reference Equality

```javascript
// SAME REFERENCE = STABLE
const fn1 = useCallback(() => {}, []);
const fn2 = fn1;
console.log(fn1 === fn2); // ✅ true - STABLE

// DIFFERENT REFERENCE = UNSTABLE
const fn3 = () => {};
const fn4 = () => {};
console.log(fn3 === fn4); // ❌ false - UNSTABLE (new function each time)
```

### In Your BadTodoItem Example:

```javascript
// Parent component (BadTodoList)
function BadTodoList() {
  const [todos, setTodos] = useState([...]);

  // 🔴 This function is RECREATED on EVERY render
  const handleToggle = (id: number) => {  // New reference each time!
    setTodos(prev => prev.map(...));
  };

  return (
    <BadTodoItem
      todo={todo}           // Object - new reference each time
      onToggle={handleToggle}  // Function - new reference each time
    />
  );
}

// Child component
function BadTodoItem({ todo, onToggle }) {
  useRenderCheckup("BadTodoItem", { todo, onToggle });
  // ↑ This compares props on EACH render
}
```

**What happens:**

```
Render #1:
  prevProps: { todo: { id: 1, ... }, onToggle: function_A }
  currProps: { todo: { id: 1, ... }, onToggle: function_A }
  Comparison: function_A === function_A ✅ SAME
  Result: ✅ No warning

Parent re-renders (user clicks increment elsewhere):
Render #2:
  prevProps: { todo: { id: 1, ... }, onToggle: function_A }
  currProps: { todo: { id: 1, ... }, onToggle: function_B }  // NEW FUNCTION!
  Comparison: function_A === function_B ❌ DIFFERENT
  Result: ⚠️ Warning! onToggle changed (but todo didn't change value)
```

---

## 3. 📊 The Detection Flow in Code

### A. `detectChangedProps()` Function

```typescript
function detectChangedProps(prevProps: any, nextProps: any): PropChange[] {
  const changes: PropChange[] = [];
  const allKeys = new Set([
    ...Object.keys(prevProps),
    ...Object.keys(nextProps),
  ]);

  allKeys.forEach((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    // 🔍 THE KEY COMPARISON: Reference equality
    if (prevValue !== nextValue) {
      // 🏷️ Classify the prop type
      const isUnstable =
        typeof nextValue === "function" ||
        (typeof nextValue === "object" && nextValue !== null);

      changes.push({
        propName: key,
        previousValue: prevValue,
        currentValue: nextValue,
        isUnstable, // ⚠️ Functions and objects are flagged
      });
    }
  });

  return changes;
}
```

**Logic Breakdown:**

1. **Get all prop names** from both previous and current props
2. **For each prop:**
   - Compare using `!==` (reference inequality)
   - If different → Mark as changed
   - If it's a function or object → Mark as "unstable"
3. **Return array** of all changed props

---

## 4. 🎨 Suggestion Generation Logic

```typescript
function generateSuggestions(
  changedProps: PropChange[]
): MemoizationSuggestion[] {
  const suggestions: MemoizationSuggestion[] = [];

  changedProps.forEach((prop) => {
    if (prop.isUnstable) {
      // 🔍 Check type and suggest appropriate hook

      if (typeof prop.currentValue === "function") {
        suggestions.push({
          type: "useCallback",
          reason: `Function prop "${prop.propName}" creates new reference on each render`,
          propName: prop.propName,
          confidence: "high",
        });
      } else if (Array.isArray(prop.currentValue)) {
        suggestions.push({
          type: "useMemo",
          reason: `Array prop "${prop.propName}" creates new reference on each render`,
          propName: prop.propName,
          confidence: "high",
        });
      } else {
        suggestions.push({
          type: "useMemo",
          reason: `Object prop "${prop.propName}" creates new reference on each render`,
          propName: prop.propName,
          confidence: "high",
        });
      }
    }
  });

  // 🚨 Special case: No props changed but component still rendered
  if (changedProps.length === 0) {
    suggestions.push({
      type: "React.memo",
      reason: "Component re-rendered without prop changes",
      confidence: "high",
    });
  }

  return suggestions;
}
```

---

## 5. 🌳 Cause Tree Logic

The cause tree shows the **chain of renders**:

```typescript
function buildCauseTree(
  componentName: string,
  changedProps: PropChange[],
  parentNode: CauseNode | null = null
): CauseNode | null {
  if (changedProps.length === 0) return null;

  // Find the "root cause" - the unstable prop
  const rootCause = changedProps.find((prop) => prop.isUnstable);

  if (!rootCause) {
    return {
      componentName,
      propName: changedProps[0].propName,
      reason: "Prop value changed",
      parent: parentNode,
      children: [],
    };
  }

  const causeNode: CauseNode = {
    componentName,
    propName: rootCause.propName,
    reason: `Unstable ${typeof rootCause.currentValue} passed as prop`,
    parent: parentNode,
    children: [],
  };

  return causeNode;
}
```

**Example Cause Tree:**

```
App (re-rendered)
  ↓ passed unstable function
BadTodoList
  ↓ passed unstable function (handleToggle)
BadTodoItem ← YOU ARE HERE
  Reason: "Unstable function passed as prop"
  Prop: "onToggle"
```

---

## 6. 🎯 Real Example Walkthrough

Let's trace what happens with `BadTodoItem`:

```tsx
// Initial render
function BadTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
  ]);

  const handleToggle = (id) => {
    /* ... */
  }; // Function A created

  return <BadTodoItem todo={todos[0]} onToggle={handleToggle} />;
}

function BadTodoItem({ todo, onToggle }) {
  useRenderCheckup("BadTodoItem", { todo, onToggle });
  // Stored in ref: { todo: {id:1,...}, onToggle: Function A }
  return <div>...</div>;
}
```

**User clicks a button in parent (not related to todos):**

```tsx
// Parent re-renders
function BadTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
  ]);

  const handleToggle = (id) => {
    /* ... */
  }; // Function B created (NEW!)

  return <BadTodoItem todo={todos[0]} onToggle={handleToggle} />;
}

// BadTodoItem receives new props
function BadTodoItem({ todo, onToggle }) {
  useRenderCheckup("BadTodoItem", { todo, onToggle });

  // useEffect runs:
  // Previous: { todo: {id:1,...}, onToggle: Function A }
  // Current:  { todo: {id:1,...}, onToggle: Function B }

  // detectChangedProps() compares:
  // todo: {id:1,...} !== {id:1,...}  ❌ Different reference!
  // onToggle: Function A !== Function B  ❌ Different reference!

  // Result: 2 changed props
  // Both are unstable (object and function)

  // Console output:
  // 🔄 BadTodoItem rendered (#2)
  //   Changed props: todo, onToggle
  //   💡 Suggestions:
  //   - useMemo: Object prop "todo" creates new reference
  //   - useCallback: Function prop "onToggle" creates new reference
}
```

---

## 7. 🔬 Why `===` Comparison Works

JavaScript uses **reference equality** for objects and functions:

```javascript
// Primitives (strings, numbers) compare by VALUE
const a = "hello";
const b = "hello";
console.log(a === b); // ✅ true

// Objects compare by REFERENCE
const obj1 = { name: "test" };
const obj2 = { name: "test" };
console.log(obj1 === obj2); // ❌ false - different references!

const obj3 = obj1;
console.log(obj1 === obj3); // ✅ true - same reference

// Functions compare by REFERENCE
const fn1 = () => {};
const fn2 = () => {};
console.log(fn1 === fn2); // ❌ false - different functions!

const fn3 = fn1;
console.log(fn1 === fn3); // ✅ true - same reference
```

---

## 8. 📊 The Complete useRenderCheckup Flow

```
Component Renders
    ↓
useRenderCheckup("ComponentName", props) called
    ↓
useEffect hook triggers (after DOM update)
    ↓
Increment render count: renderCountRef.current++
    ↓
Call detectChangedProps(prevProps, currentProps)
    ├─ Compare each prop with !==
    ├─ Mark functions/objects as "unstable"
    └─ Return array of changed props
    ↓
Call buildCauseTree(componentName, changedProps)
    └─ Create tree structure showing render chain
    ↓
Call generateSuggestions(changedProps)
    ├─ If function prop changed → suggest useCallback
    ├─ If object/array prop changed → suggest useMemo
    └─ If no props changed → suggest React.memo
    ↓
Create RenderInfo object:
    {
      componentName: "BadTodoItem",
      renderCount: 2,
      timestamp: 1702339200000,
      changedProps: [...],
      causeTree: {...}
    }
    ↓
Store in RenderTracker (singleton)
    ↓
If logToConsole === true:
    ├─ Group collapsed with color
    ├─ Log changed props
    ├─ Log suggestions
    └─ Log cause tree
    ↓
Call onRender callback (if provided)
    ↓
Update prevPropsRef for next render
```

---

## 9. 🧪 How to Verify the Logic

### Test 1: Check Reference Changes

```typescript
// Add to BadTodoItem
function BadTodoItem({ todo, onToggle }: any) {
  useRenderCheckup("BadTodoItem", { todo, onToggle });

  // Manual check
  console.log("todo reference:", todo);
  console.log("onToggle reference:", onToggle);
  // Each render, these will be DIFFERENT objects/functions

  return <div>...</div>;
}
```

### Test 2: Compare with Good Example

```typescript
// GoodTodoList uses useCallback
const handleToggle = useCallback((id: number) => {
  setTodos(prev => prev.map(...));
}, []); // ← Empty deps means function NEVER changes

// Result: onToggle reference stays the SAME across renders
// BadTodoItem won't see it as changed (unless todo object changes)
```

### Test 3: Add Logging

```typescript
function detectChangedProps(prevProps: any, nextProps: any): PropChange[] {
  // ... existing code ...

  allKeys.forEach((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    // ADD THIS:
    console.log(`Comparing ${key}:`, prevValue === nextValue);
    console.log(`  Previous:`, prevValue);
    console.log(`  Current:`, nextValue);

    if (prevValue !== nextValue) {
      // ... mark as changed ...
    }
  });
}
```

---

## 10. 🎯 Key Takeaways

| Concept                | Explanation                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Reference Equality** | Uses `===` to compare props - objects/functions with same values but different references are "different" |
| **Unstable Props**     | Functions and objects that change reference on every render                                               |
| **Stable Props**       | Props that maintain the same reference (primitives or memoized values)                                    |
| **Detection Timing**   | Happens in `useEffect` AFTER the render completes                                                         |
| **Comparison**         | Compares current render's props vs previous render's props                                                |
| **Storage**            | Previous props stored in `useRef` to persist across renders                                               |

---

## 11. 🚀 Quick Test Commands

```bash
# 1. Run the demo
cd /home/sanmark/Documents/learn/react-render-checkup/example
npx vite

# 2. Open http://localhost:5173
# 3. Open Console (F12)
# 4. Click "Show Bad Example"
# 5. Click "Toggle" button
# 6. Watch console output

# You'll see:
# 🔄 BadTodoItem rendered (#1)
#   Changed props: todo, onToggle
#   💡 Suggestions:
#   - useCallback: Function prop "onToggle" creates new reference...
```

---

## 12. 🎓 The "Aha!" Moment

**Without useCallback:**

```javascript
// Every render creates a NEW function
const handleToggle = (id) => {
  /* ... */
};
// JavaScript sees this as a DIFFERENT function each time
```

**With useCallback:**

```javascript
// Same function reference is reused
const handleToggle = useCallback((id) => {
  /* ... */
}, []);
// JavaScript sees this as the SAME function
```

**React Render Checkup detects this by comparing:**

```javascript
previousFunction === currentFunction;
// false without useCallback ❌
// true with useCallback ✅
```

---

That's the complete logic! The tool essentially acts as a "reference change detector" that alerts you when props are unnecessarily changing references, causing re-renders. 🎯
