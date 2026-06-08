const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/dist/**",
      "**/web-build/**",
      "**/android/**",
      "**/ios/**",
      "**/coverage/**",
      "assets/fonts/**",
      "assets/lottie/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "warn",
      "import/no-duplicates": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "prefer-const": "warn",
      eqeqeq: ["warn", "always", { null: "ignore" }],
      curly: ["warn", "multi-line"],
    },
  },
  {
    files: [
      "**/*.config.js",
      "**/*.config.cjs",
      "**/*.config.mjs",
      "scripts/**",
      "plugins/**",
      "public/**",
    ],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
      "no-console": "off",
    },
  },
]);
