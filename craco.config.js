module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /react-spring/,
            sideEffects: true
          }
        ]
      }
    }
  },
  babel: {
    plugins: [["@babel/plugin-proposal-nullish-coalescing-operator"]],
  }
};