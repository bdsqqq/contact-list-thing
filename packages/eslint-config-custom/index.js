const { defineConfig, globalIgnores } = require("eslint/config");
const next = require("eslint-config-next");
const prettier = require("eslint-config-prettier");
const turbo = require("eslint-config-turbo/flat").default;

module.exports = defineConfig([
  ...next,
  ...turbo,
  prettier,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
