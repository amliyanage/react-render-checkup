# Quick Start Guide

## 🚀 Getting Started with React Render Checkup

### Prerequisites

- Node.js 16+ and npm
- A React project

### Step 1: Clone and Build

```bash
# Clone the repository
cd /home/sanmark/Documents/learn/react-render-checkup

# Install dependencies
npm install

# Build all packages
npm run build
```

### Step 2: Run the Example

The easiest way to see React Render Checkup in action is to run the example application:

```bash
# Navigate to the example directory
cd example

# Install example dependencies
npm install

# Start the development server
npm run dev
```

Then:

1. Open your browser to the URL shown (usually http://localhost:5173)
2. **Open your browser console** (F12)
3. Click on the buttons to show different examples
4. Watch the console for detailed render information!

### Step 3: Use in Your Own Project

#### Install the Packages

Since this is a local monorepo, you can link the packages:

```bash
# From the root of react-render-checkup
cd packages/eslint-plugin-checkup
npm link

cd ../react-hook-checkup
npm link

# In your project
cd /path/to/your/project
npm link eslint-plugin-react-render-checkup
npm link react-hook-checkup
```

Or install directly from the file system:

```bash
npm install --save-dev file:/home/sanmark/Documents/learn/react-render-checkup/packages/eslint-plugin-checkup
npm install --save-dev file:/home/sanmark/Documents/learn/react-render-checkup/packages/react-hook-checkup
```

#### Configure ESLint

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["react-render-checkup"],
  rules: {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "error",
    "react-render-checkup/require-stable-deps": "warn",
  },
};
```

#### Use in Your Components

```typescript
import { useRenderCheckup } from "react-hook-checkup";

function MyComponent({ data, onUpdate }) {
  useRenderCheckup("MyComponent", { data, onUpdate });

  return <div>{/* Your component JSX */}</div>;
}
```

### What to Look For

When you interact with your app:

1. **Green messages** 🟢 - Normal renders with prop changes
2. **Orange warnings** 🟠 - Unnecessary renders (no props changed)
3. **Suggestions** 💡 - Actionable optimization tips
4. **Cause Trees** 🌳 - Visual representation of render causes

### Common Issues

#### Issue: Console is too noisy

**Solution:** Reduce logging:

```typescript
useRenderCheckup("MyComponent", props, {
  logToConsole: false, // Disable console logging
  onRender: (info) => {
    // Custom handling - only log unnecessary renders
    if (info.changedProps.length === 0) {
      console.warn("Unnecessary render in", info.componentName);
    }
  },
});
```

#### Issue: Want to see prop values

**Solution:** Enable value logging:

```typescript
useRenderCheckup("MyComponent", props, {
  includeValues: true, // Show actual prop values
});
```

#### Issue: ESLint rules are too strict

**Solution:** Adjust rule severity:

```javascript
{
  'react-render-checkup/no-inline-function-props': 'off', // or ['warn', { allowedProps: [...] }]
}
```

### Next Steps

- Read the [main README](./README.md) for comprehensive documentation
- Check out the [example app](./example) for real-world usage
- Explore individual package READMEs:
  - [ESLint Plugin](./packages/eslint-plugin-checkup/README.md)
  - [React Hook](./packages/react-hook-checkup/README.md)

### Tips

1. **Start with one component** - Don't add to all components at once
2. **Focus on leaf components** - Components that render often but shouldn't
3. **Use with React DevTools Profiler** - Combine tools for best results
4. **Only in development** - The hooks automatically disable in production

## Need Help?

Open an issue or check the [Contributing Guide](./CONTRIBUTING.md)!
