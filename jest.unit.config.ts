import jestConfig from "./jest.config";

export default {
  ...jestConfig,
  testMatch: ["**/*.spec.ts"],

  setupFilesAfterEnv: ["<rootDir>/tests/config/prisma.mock.ts"]
}