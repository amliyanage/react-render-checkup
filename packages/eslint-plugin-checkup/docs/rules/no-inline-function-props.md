# no-inline-function-props

Disallows inline arrow functions, object literals, and array literals as props to React components.

## Rule Details

Passing inline functions, objects, or arrays as props creates new references on every render, which breaks memoization and can cause unnecessary re-renders of child components.

### ❌ Incorrect

```tsx
// Inline arrow function
<Button onClick={() => handleClick()} />

// Inline object literal
<Component config={{ theme: 'dark' }} />

// Inline array literal
<List items={[1, 2, 3]} />

// Multiple issues
<MyComponent
  onClick={() => doSomething()}
  style={{ color: 'red' }}
  data={[1, 2, 3]}
/>
```

### ✅ Correct

```tsx
// Stable function reference
const handleButtonClick = useCallback(() => handleClick(), []);
<Button onClick={handleButtonClick} />;

// Memoized object
const config = useMemo(() => ({ theme: "dark" }), []);
<Component config={config} />;

// Memoized array
const items = useMemo(() => [1, 2, 3], []);
<List items={items} />;

// Or define outside component if truly constant
const STATIC_CONFIG = { theme: "dark" };
<Component config={STATIC_CONFIG} />;
```

## Options

```typescript
{
  "react-render-checkup/no-inline-function-props": ["warn", {
    "allowedProps": ["style", "className", "key"],
    "checkAllComponents": false
  }]
}
```

### `allowedProps`

Array of prop names that are allowed to have inline values. Default: `["style", "className", "key"]`

These props are commonly expected to be inline and don't typically cause performance issues.

### `checkAllComponents`

Boolean indicating whether to check all components or only potentially memoized ones. Default: `false`

When `false`, the rule is less strict and focuses on components that are likely to benefit from optimization.

## When Not To Use It

- In prototyping or early development where performance is not a concern
- For props that genuinely need to be different on every render
- In components that explicitly don't use memoization

## Further Reading

- [React Documentation: useCallback](https://react.dev/reference/react/useCallback)
- [React Documentation: useMemo](https://react.dev/reference/react/useMemo)
- [React Documentation: React.memo](https://react.dev/reference/react/memo)
