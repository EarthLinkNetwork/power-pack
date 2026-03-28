const base = require("../jest.config.base");
module.exports = {
  ...base,
  roots: ["<rootDir>/tests"],
  // Meta-package is a barrel re-export file; individual packages have full coverage.
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 50,
      lines: 100,
      statements: 100,
    },
  },
};
