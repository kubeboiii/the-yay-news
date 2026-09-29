import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import onlyWarn from "eslint-plugin-only-warn";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for the repository.
 *
 * ESLint's flat config lints only .js/.mjs/.cjs unless a config names other extensions in `files`,
 * so the TypeScript sources are listed explicitly. typescript-eslint parses them (syntax only, no
 * type information). It supports TypeScript < 6.1, so this package carries its own TypeScript 6
 * for parsing; the apps still build and type-check with TypeScript 7.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**", "**/generated/**"],
  },
];
