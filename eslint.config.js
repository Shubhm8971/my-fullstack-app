import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    ignores: ["dist/**"],
  },
  pluginJs.configs.recommended,
  {
    ...pluginReactConfig,
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      globals: {
        ...globals.browser,
      }
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReactConfig.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }]
    },
  },
  {
    files: ["eslint.config.js", "vite.config.js", "server.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }]
    }
  },
];