import pluginNext from "@next/eslint-plugin-next"

const eslintConfig = [
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "convex/_generated/**"],
  },
]

export default eslintConfig
