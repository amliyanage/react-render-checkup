# React Hook Checkup

Runtime React hooks for detecting and tracking re-render issues with visual cause trees.

## Installation

```bash
npm install --save-dev react-hook-checkup
```

## Quick Start

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent({ data, onUpdate }) {
  useRenderCheckup("MyComponent", { data, onUpdate });

  return <div>{data.name}</div>;
}
```

Now open your browser console and interact with your component. You'll see detailed render information including:

- Which props changed
- Suggestions for optimization
- Cause trees showing the root of render issues

## API

### `useRenderCheckup(componentName, props, options)`

Tracks component renders and detects performance issues.

**Parameters:**

- `componentName` (string) - Name of the component
- `props` (object) - Current props to track
- `options` (object) - Configuration options

**Options:**

```typescript
interface CheckupOptions {
  enabled?: boolean; // Enable/disable (default: true in dev)
  logToConsole?: boolean; // Log to console (default: true)
  trackCauseTree?: boolean; // Build cause tree (default: true)
  includeValues?: boolean; // Include values in logs (default: false)
  onRender?: (info: RenderInfo) => void; // Custom callback
}
```

**Example:**

```tsx
function MyComponent(props) {
  useRenderCheckup("MyComponent", props, {
    logToConsole: true,
    trackCauseTree: true,
    includeValues: false,
  });

  return <div>...</div>;
}
```

### `withRenderCheckup(Component, options)`

HOC to automatically track renders.

**Example:**

```tsx
const TrackedComponent = withRenderCheckup(MyComponent, {
  logToConsole: true,
});
```

### `getRenderStats(componentName)`

Get render statistics for a component.

**Returns:**

```typescript
{
  totalRenders: number;
  unnecessaryRenders: number;
  averageChangedProps: number;
}
```

**Example:**

```tsx
const stats = getRenderStats("MyComponent");
console.log(`Total renders: ${stats.totalRenders}`);
console.log(`Unnecessary: ${stats.unnecessaryRenders}`);
```

### `getTrackedComponents()`

Get list of all tracked components.

**Example:**

```tsx
const components = getTrackedComponents();
console.log("Tracked components:", components);
```

### `clearCheckupData()`

Clear all tracking data.

**Example:**

```tsx
clearCheckupData(); // Reset all render history
```

### `exportCheckupData()`

Export tracking data as JSON.

**Example:**

```tsx
const data = exportCheckupData();
console.log(data); // Full render history
```

## Console Output

### Healthy Render

```
🔄 MyComponent rendered (#2)
  Changed props: data
  ✓ Component rendered due to legitimate prop change
```

### Unnecessary Render

```
🔄 MyComponent rendered (#5)
  ⚠️ Unnecessary render - no props changed

  💡 Suggestions:
  - React.memo: Component re-rendered without prop changes
```

### Unstable Props

```
🔄 MyComponent rendered (#3)
  Changed props: onUpdate

  💡 Suggestions:
  - useCallback: Function prop "onUpdate" creates new reference on each render

  Cause tree: {
    componentName: "MyComponent",
    propName: "onUpdate",
    reason: "Unstable function passed as prop"
  }
```

## Advanced Usage

### Custom Render Callback

```tsx
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent(props) {
  useRenderCheckup("MyComponent", props, {
    onRender: (info) => {
      // Send to analytics
      if (info.changedProps.length === 0) {
        analytics.track("unnecessary_render", {
          component: info.componentName,
        });
      }
    },
  });

  return <div>...</div>;
}
```

### Development Only

The hook automatically disables in production (`NODE_ENV === 'production'`), but you can explicitly control it:

```tsx
useRenderCheckup("MyComponent", props, {
  enabled: process.env.NODE_ENV === "development",
});
```

## TypeScript Support

Full TypeScript support with type definitions included.

```typescript
import { RenderInfo, PropChange, CauseNode } from "react-hook-checkup";

const handleRender = (info: RenderInfo) => {
  console.log(`${info.componentName} rendered ${info.renderCount} times`);
};
```

## Examples

See the [example](../../example) directory for a working demonstration.
