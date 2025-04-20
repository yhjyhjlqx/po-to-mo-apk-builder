module.exports = {
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./scripts/**/*']
    }
  }
};
