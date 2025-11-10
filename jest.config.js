// jest.config.js - Root Jest configuration file
module.exports = {
  // Base configuration for all tests
  projects: [
    // Backend (no external DB): week-6-mern-assignment/backend
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/week-6-mern-assignment/backend/tests/**/*.test.js'],
      moduleFileExtensions: ['js', 'json', 'node'],
      coverageDirectory: '<rootDir>/coverage/backend',
      collectCoverageFrom: [
        'week-6-mern-assignment/backend/src/**/*.js',
        '!**/node_modules/**',
      ],
    },

    // Client-side tests configuration
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/**/*.test.{js,jsx}'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/client/src/tests/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/client/src/tests/setup.js'],
      transform: {
        '^.+\\\.(js|jsx)$': 'babel-jest',
      },
      coverageDirectory: '<rootDir>/coverage/client',
      collectCoverageFrom: [
        'client/src/**/*.{js,jsx}',
        '!client/src/index.js',
        '!**/node_modules/**',
      ],
    },
  ],

  // Global configuration
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
}; 