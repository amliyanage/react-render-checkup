import { noInlineFunctionProps } from "./rules/no-inline-function-props";
import { exhaustiveDeps } from "./rules/exhaustive-deps";
import { requireStableDeps } from "./rules/require-stable-deps";

const plugin = {
  meta: {
    name: "eslint-plugin-react-render-checkup",
    version: "1.0.0",
  },
  rules: {
    "no-inline-function-props": noInlineFunctionProps,
    "exhaustive-deps": exhaustiveDeps,
    "require-stable-deps": requireStableDeps,
  },
  configs: {
    recommended: {
      plugins: ["react-render-checkup"],
      rules: {
        "react-render-checkup/no-inline-function-props": "warn",
        "react-render-checkup/exhaustive-deps": "error",
        "react-render-checkup/require-stable-deps": "warn",
      },
    },
  },
};

export default plugin;
