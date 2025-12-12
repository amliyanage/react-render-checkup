# require-stable-deps

Suggests memoization for unstable dependencies passed to React hooks.

## Rule Details

This rule identifies when objects, arrays, or functions are used as dependencies in React hooks without being properly memoized, which can lead to performance issues or infinite loops.

### ❌ Incorrect

```tsx
function Component() {
  // Object created on every render
  const options = { method: "GET" };

  useEffect(() => {
    fetch("/api", options);
  }, [options]); // Unstable - new object every render
}

function Component() {
  // Array created on every render
  const ids = [1, 2, 3];

  const result = useMemo(() => {
    return processIds(ids);
  }, [ids]); // Unstable - new array every render
}

function Component() {
  // Function created on every render
  const handler = () => console.log("Hello");

  useEffect(() => {
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [handler]); // Unstable - new function every render
}
```

### ✅ Correct

```tsx
function Component() {
  // Memoized object
  const options = useMemo(() => ({ method: "GET" }), []);

  useEffect(() => {
    fetch("/api", options);
  }, [options]);
}

function Component() {
  // Memoized array
  const ids = useMemo(() => [1, 2, 3], []);

  const result = useMemo(() => {
    return processIds(ids);
  }, [ids]);
}

function Component() {
  // Memoized function
  const handler = useCallback(() => console.log("Hello"), []);

  useEffect(() => {
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [handler]);
}

// Or define outside component if truly constant
const OPTIONS = { method: "GET" };
const IDS = [1, 2, 3];

function Component() {
  useEffect(() => {
    fetch("/api", OPTIONS);
  }, []);
}
```

## How It Works

The rule tracks variable declarations within component functions and identifies:

1. Objects declared with object literal syntax
2. Arrays declared with array literal syntax
3. Functions declared with arrow or function expressions

When these are used as dependencies in hooks, the rule suggests appropriate memoization.

## Suggested Fixes

- **Objects**: Use `useMemo(() => ({ ... }), deps)`
- **Arrays**: Use `useMemo(() => [...], deps)`
- **Functions**: Use `useCallback(() => { ... }, deps)`

## When Not To Use It

- When dependencies genuinely need to change on every render
- In components that are not performance-critical
- When using constants defined outside the component

## Further Reading

- [React Documentation: useMemo](https://react.dev/reference/react/useMemo)
- [React Documentation: useCallback](https://react.dev/reference/react/useCallback)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
