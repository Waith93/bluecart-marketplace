export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./src/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};

