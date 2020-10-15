import {
  getNodeEnv,
  isDevEnv,
  isProdEnv,
  isTestEnv,
  shouldBypassAuth,
  getMongoDbUrl,
} from "src/utils";

describe("Node environment", () => {
  it("should throw assertion error if not set", () => {
    delete process.env.NODE_ENV;
    expect(getNodeEnv).toThrow();
    expect(isDevEnv).toThrow();
    expect(isTestEnv).toThrow();
    expect(isProdEnv).toThrow();
  });

  it("should return correct env if set", () => {
    process.env.NODE_ENV = "dev";
    expect(isDevEnv()).toBe(true);

    process.env.NODE_ENV = "test";
    expect(isTestEnv()).toBe(true);

    process.env.NODE_ENV = "prod";
    expect(isProdEnv()).toBe(true);
  });
});

describe("Bypass auth", () => {
  beforeAll(() => {
    process.env.BYPASS_AUTH = "true";
  });

  it("can only be true in non-prod env", () => {
    process.env.NODE_ENV = "dev";
    expect(shouldBypassAuth()).toBe(true);

    process.env.NODE_ENV = "test";
    expect(shouldBypassAuth()).toBe(true);
  });

  it("should throw assertion error in prod env", () => {
    process.env.NODE_ENV = "prod";
    expect(shouldBypassAuth).toThrow();
  });
});

describe("Mongo DB URL", () => {
  it("should return a string for each node environment", () => {
    process.env.NODE_ENV = "dev";
    expect(getMongoDbUrl()).toBeTruthy();

    process.env.NODE_ENV = "test";
    expect(getMongoDbUrl()).toBeTruthy();

    process.env.NODE_ENV = "prod";
    expect(getMongoDbUrl()).toBeTruthy();
  });

  it("should return the @shelf/jest-mongodb URL in test environment", () => {
    process.env.NODE_ENV = "test";
    expect(getMongoDbUrl()).toBe(process.env.MONGO_URL);
  });
});
