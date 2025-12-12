import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/react-render-checkup/tree/main/packages/eslint-plugin-checkup/docs/rules/${name}.md`
);

export const requireStableDeps = createRule({
  name: "require-stable-deps",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Suggests memoization for unstable dependencies passed to React hooks",
    },
    messages: {
      unstableObject:
        "Object {{name}} should be memoized with useMemo when used as a dependency in {{hookName}}.",
      unstableArray:
        "Array {{name}} should be memoized with useMemo when used as a dependency in {{hookName}}.",
      unstableFunction:
        "Function {{name}} should be wrapped with useCallback when used as a dependency in {{hookName}}.",
    },
    schema: [],
    hasSuggestions: false,
  },
  defaultOptions: [],
  create(context) {
    const reactHooks = new Set([
      "useEffect",
      "useLayoutEffect",
      "useMemo",
      "useCallback",
      "useImperativeHandle",
    ]);
    const componentScope = new Map<
      string,
      { type: "object" | "array" | "function"; node: TSESTree.Node }
    >();

    return {
      // Track variable declarations in component scope
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression"(
        node:
          | TSESTree.FunctionDeclaration
          | TSESTree.FunctionExpression
          | TSESTree.ArrowFunctionExpression
      ) {
        // Check if this is a React component (starts with capital letter)
        const functionName =
          node.type === "FunctionDeclaration" && node.id ? node.id.name : null;

        if (!functionName || !/^[A-Z]/.test(functionName)) {
          return;
        }

        // Visit body to find variable declarations
        if (node.body.type === "BlockStatement") {
          for (const statement of node.body.body) {
            if (statement.type === "VariableDeclaration") {
              for (const declarator of statement.declarations) {
                if (declarator.id.type === "Identifier" && declarator.init) {
                  const varName = declarator.id.name;
                  if (declarator.init.type === "ObjectExpression") {
                    componentScope.set(varName, {
                      type: "object",
                      node: declarator.init,
                    });
                  } else if (declarator.init.type === "ArrayExpression") {
                    componentScope.set(varName, {
                      type: "array",
                      node: declarator.init,
                    });
                  } else if (
                    declarator.init.type === "ArrowFunctionExpression" ||
                    declarator.init.type === "FunctionExpression"
                  ) {
                    componentScope.set(varName, {
                      type: "function",
                      node: declarator.init,
                    });
                  }
                }
              }
            }
          }
        }
      },

      CallExpression(node) {
        if (
          node.callee.type !== "Identifier" ||
          !reactHooks.has(node.callee.name)
        ) {
          return;
        }

        const hookName = node.callee.name;
        const depsArg = node.arguments[1];

        if (!depsArg || depsArg.type !== "ArrayExpression") {
          return;
        }

        // Check each dependency
        for (const element of depsArg.elements) {
          if (element && element.type === "Identifier") {
            const depName = element.name;
            const varInfo = componentScope.get(depName);

            if (varInfo) {
              if (varInfo.type === "object") {
                context.report({
                  node: element,
                  messageId: "unstableObject",
                  data: { name: depName, hookName },
                });
              } else if (varInfo.type === "array") {
                context.report({
                  node: element,
                  messageId: "unstableArray",
                  data: { name: depName, hookName },
                });
              } else if (varInfo.type === "function") {
                context.report({
                  node: element,
                  messageId: "unstableFunction",
                  data: { name: depName, hookName },
                });
              }
            }
          }
        }
      },
    };
  },
});
