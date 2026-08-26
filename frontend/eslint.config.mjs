// Flat config (ESLint 9+, required by eslint-config-next@16 -- `next lint`
// itself was removed in Next 16, so `npm run lint` now runs `eslint .`
// directly). Replaces the old .eslintrc.json.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Stub functions across this scaffold keep their documented parameter
      // names before they're implemented (raise "Not implemented" instead
      // of using them) -- see CLAUDE.md / backend's own NotImplementedError
      // pattern. Unused *local variables* still error; only unused function
      // arguments are relaxed.
      "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    },
  },
];

export default eslintConfig;
