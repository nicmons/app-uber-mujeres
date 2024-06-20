module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],
  plugins: [],
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["#M", "./src/models"],
          ["#R", "./src/routes"],
          ["#S", "./src/socket"],
          ["#C", "./src/controllers"],
          ["#MW", "./src/middlewares"],
          ["#H", "./src/helpers"],
          ["#DB", "./src/db"],
          ["#SRC", "./src"],
        ],
        extensions: [".js"],
      },
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
      },
    ],
  },
};
