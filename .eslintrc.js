module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": [
      0
    ],
    "@typescript-eslint/no-inferrable-types": [
      0
    ],
    "@typescript-eslint/explicit-module-boundary-types": [
      0
    ],
    "@typescript-eslint/no-explicit-any": [
      0
    ],
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "_[iI]gnored",
        "ignoreRestSiblings": true
      }
    ]
  }
};