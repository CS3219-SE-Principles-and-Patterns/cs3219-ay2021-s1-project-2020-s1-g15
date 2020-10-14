/* eslint-disable @typescript-eslint/no-var-requires */
const tsJest = require("ts-jest/jest-preset");
const mongodbJest = require("@shelf/jest-mongodb/jest-preset");

module.exports = {
  // use multiple presets: https://stackoverflow.com/questions/51002460/is-it-possible-to-use-jest-with-multiple-presets-at-the-same-time
  ...tsJest,
  ...mongodbJest,
  testEnvironment: "node",
  // collect coverage only from src/ dir
  collectCoverageFrom: ["src/**/*.ts"],
  // ignore dist/ dir
  testPathIgnorePatterns: ["/dist/"],
  moduleDirectories: [
    // look into node_modules dir first:
    "node_modules",
    // then look into this dir, which makes this dir the start of the absolute path (example import: `import { titleToSlug } from "src/utils"`)
    ".",
  ],
};
