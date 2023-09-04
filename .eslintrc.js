module.exports = {
  root: true,
  extends: ['universe/native'],
  rules: {
    quotes: ['warn', 'single'],
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
      },
    ],
  },
};
