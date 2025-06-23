import { defineConfig } from "eslint/config";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";

import pkg from "@eslint/js";  // importa todo como default
const { configs } = pkg;       // extrae configs

export default defineConfig([
  {
    files: ["**/*.{js,cjs}"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "commonjs",
    },
    plugins: {
      stylistic,
    },
    extends: [configs.recommended],  // usa configs.recommended aquí
    rules: {
      "stylistic/indent": ["error", 2],
      "stylistic/linebreak-style": ["error", "unix"],
      "stylistic/quotes": ["error", "single"],
      "stylistic/semi": ["error", "never"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": 0
    },
  },
]);
