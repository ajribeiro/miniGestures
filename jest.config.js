module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!jest.setup.js',
    '!coin.js',
    '!coverage/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
