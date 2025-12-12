# exhaustive-deps

Ensures that dependency arrays in React hooks are complete and accurate.

## Rule Details

This rule verifies that all dependencies used within `useEffect`, `useLayoutEffect`, `useMemo`, `useCallback`, and `useImperativeHandle` are properly declared in the dependency array.

### ❌ Incorrect

```tsx
// Missing dependency
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId); // userId is used but not in deps
  }, []); // Empty array - missing userId
}

// Unnecessary dependency
function Component({ data }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count, data]); // data is not used
}

// Unstable dependency
function Component() {
  const config = { api: "/api/data" };

  useEffect(() => {
    fetch(config.api);
  }, [config]); // config is recreated every render
}
```

### ✅ Correct

```tsx
// Complete dependencies
function Component({ userId }) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]); // All dependencies included
}

// Only necessary dependencies
function Component({ data }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]); // Only what's used
}

// Stable dependency
function Component() {
  const config = useMemo(() => ({ api: "/api/data" }), []);

  useEffect(() => {
    fetch(config.api);
  }, [config]); // config is now stable
}
```

## Comparison with React's exhaustive-deps

This rule is similar to React's built-in exhaustive-deps rule but with enhanced detection for:

- Unstable dependencies that may cause infinite loops
- Better handling of setter functions from useState
- More accurate detection of referenced variables

## When Not To Use It

This rule should generally always be enabled, but you might disable it if:

- You're using a different dependency management strategy
- You have specialized hooks that don't follow standard patterns

## Further Reading

- [React Documentation: useEffect](https://react.dev/reference/react/useEffect)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
