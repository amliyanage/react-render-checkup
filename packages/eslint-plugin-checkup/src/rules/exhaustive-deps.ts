import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/react-render-checkup/tree/main/packages/eslint-plugin-checkup/docs/rules/${name}.md`
);

export const exhaustiveDeps = createRule({
  name: "exhaustive-deps",
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensures dependencies in useEffect, useMemo, and useCallback are stable and exhaustive",
    },
    messages: {
      missingDependency:
        "React Hook {{hookName}} has a missing dependency: {{dep}}. Either include it or remove the dependency array.",
      unstableDependency:
        "The dependency {{dep}} in {{hookName}} may be unstable. Consider using {{suggestion}}.",
      unnecessaryDependency:
        "React Hook {{hookName}} has an unnecessary dependency: {{dep}}. Either remove it or remove the dependency array.",
    },
    schema: [],
    hasSuggestions: true,
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

    function isReactHook(node: TSESTree.CallExpression): string | null {
      if (
        node.callee.type === "Identifier" &&
        reactHooks.has(node.callee.name)
      ) {
        return node.callee.name;
      }
      return null;
    }

    function extractDependencies(
      depsArray: TSESTree.ArrayExpression
    ): Set<string> {
      const deps = new Set<string>();
      for (const element of depsArray.elements) {
        if (element && element.type === "Identifier") {
          deps.add(element.name);
        } else if (element && element.type === "MemberExpression") {
          const text = context.getSourceCode().getText(element);
          deps.add(text);
        }
      }
      return deps;
    }

    function extractReferencedVariables(node: TSESTree.Node): Set<string> {
      const referenced = new Set<string>();
      const sourceCode = context.getSourceCode();

      function visit(n: TSESTree.Node) {
        if (n.type === "Identifier") {
          referenced.add(n.name);
        } else if (n.type === "MemberExpression") {
          referenced.add(sourceCode.getText(n));
        }

        // Recursively visit children
        for (const key in n) {
          const child = (n as any)[key];
          if (child && typeof child === "object") {
            if (Array.isArray(child)) {
              child.forEach((c) => c && typeof c.type === "string" && visit(c));
            } else if (child.type) {
              visit(child);
            }
          }
        }
      }

      visit(node);
      return referenced;
    }

    return {
      CallExpression(node) {
        const hookName = isReactHook(node);
        if (!hookName) return;

        // Check if hook has dependency array (second argument for most hooks)
        const depsArgIndex =
          hookName === "useEffect" || hookName === "useLayoutEffect" ? 1 : 1;
        const depsArg = node.arguments[depsArgIndex];

        if (!depsArg) return; // No dependency array, can't check

        if (depsArg.type !== "ArrayExpression") return;

        const declaredDeps = extractDependencies(depsArg);
        const callback = node.arguments[0];

        if (
          callback &&
          (callback.type === "ArrowFunctionExpression" ||
            callback.type === "FunctionExpression")
        ) {
          const referencedVars = extractReferencedVariables(callback.body);

          // Remove built-in globals and hook names
          const builtIns = new Set([
            "console",
            "window",
            "document",
            "Math",
            "JSON",
            "Promise",
            "Set",
            "Map",
          ]);

          referencedVars.forEach((v) => {
            if (builtIns.has(v) || reactHooks.has(v) || v.startsWith("use")) {
              referencedVars.delete(v);
            }
          });

          // Check for missing dependencies
          referencedVars.forEach((ref) => {
            if (!declaredDeps.has(ref) && !ref.includes("set")) {
              context.report({
                node: depsArg,
                messageId: "missingDependency",
                data: {
                  hookName,
                  dep: ref,
                },
              });
            }
          });

          // Check for unnecessary dependencies
          declaredDeps.forEach((dep) => {
            if (!referencedVars.has(dep)) {
              context.report({
                node: depsArg,
                messageId: "unnecessaryDependency",
                data: {
                  hookName,
                  dep,
                },
              });
            }
          });
        }
      },
    };
  },
});
