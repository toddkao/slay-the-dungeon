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
  }
};