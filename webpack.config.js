const path = require('path');

module.exports = {
  // other webpack configuration options
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "tls": false,
      "net": false,
      // "process": false   // Add this if you encounter issues related to 'process'
    }
  }
};
