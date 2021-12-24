module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  rootDir: "./",
  preset: "ts-jest",
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ['lib/', 'node_modules/'],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  resolver: "jest-node-exports-resolver",
};