import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/react-render-checkup/tree/main/packages/eslint-plugin-checkup/docs/rules/${name}.md`
);

export const noInlineFunctionProps = createRule({
  name: "no-inline-function-props",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow inline arrow functions or object/array literals as props to potentially memoized components",
    },
    messages: {
      inlineArrowFunction:
        "Avoid passing inline arrow functions as props. This creates a new function on every render, breaking memoization.",
      inlineObjectLiteral:
        "Avoid passing inline object literals as props. This creates a new object on every render, breaking memoization.",
      inlineArrayLiteral:
        "Avoid passing inline array literals as props. This creates a new array on every render, breaking memoization.",
      suggestion: "Consider using {{hook}} to stabilize this value.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedProps: {
            type: "array",
            items: { type: "string" },
            description:
              "Props that are allowed to have inline values (e.g., style, className)",
          },
          checkAllComponents: {
            type: "boolean",
            description: "Check all components, not just memoized ones",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    hasSuggestions: true,
  },
  defaultOptions: [
    {
      allowedProps: ["style", "className", "key"],
      checkAllComponents: false,
    },
  ],
  create(context) {
    const options = context.options[0] || {};
    const allowedProps = (options as any).allowedProps || [
      "style",
      "className",
      "key",
    ];
    const checkAllComponents = (options as any).checkAllComponents || false;

    return {
      JSXAttribute(node) {
        if (!node.value || node.value.type !== "JSXExpressionContainer") {
          return;
        }

        const propName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (propName && allowedProps.includes(propName)) {
          return;
        }

        const expression = node.value.expression;

        // Check for inline arrow functions
        if (
          expression.type === "ArrowFunctionExpression" ||
          expression.type === "FunctionExpression"
        ) {
          context.report({
            node: expression,
            messageId: "inlineArrowFunction",
            data: {
              hook: "useCallback",
            },
            suggest: [
              {
                messageId: "suggestion",
                data: { hook: "useCallback" },
                fix: null, // Manual fix required
              },
            ],
          });
        }

        // Check for inline object literals
        if (expression.type === "ObjectExpression") {
          context.report({
            node: expression,
            messageId: "inlineObjectLiteral",
            data: {
              hook: "useMemo",
            },
            suggest: [
              {
                messageId: "suggestion",
                data: { hook: "useMemo" },
                fix: null,
              },
            ],
          });
        }

        // Check for inline array literals
        if (expression.type === "ArrayExpression") {
          context.report({
            node: expression,
            messageId: "inlineArrayLiteral",
            data: {
              hook: "useMemo",
            },
            suggest: [
              {
                messageId: "suggestion",
                data: { hook: "useMemo" },
                fix: null,
              },
            ],
          });
        }
      },
    };
  },
});
