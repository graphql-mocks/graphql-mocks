module.exports = {
  parser: "@typescript-eslint/parser",

  extends: [
    "plugin:mocha/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },

  plugins: ["mocha"],

  rules: {
  },
};
