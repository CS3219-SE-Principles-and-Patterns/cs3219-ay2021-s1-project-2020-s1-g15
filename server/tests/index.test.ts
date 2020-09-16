import { DB_NAME } from "../src/services/database";

describe("process.env environment variables", () => {
  it("should be set to TEST environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
    expect(process.env.NODE_ENV).toBe("test");

    expect(process.env.MONGO_URL).toBeDefined();
    // db name configured in jest-mongodb-config.json
    // check if the connection URL contains the configured db name
    expect(process.env.MONGO_URL?.includes(DB_NAME)).toBe(true);
  });
});
