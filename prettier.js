/**
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 80,
  endOfLine: "lf",
  overrides: [
    {
      files: [".eslintrc", "tsconfig.json", ".markdownlint.jsonc"],
      options: {
        trailingComma: "none"
      }
    }
  ],
  
};

export default config;