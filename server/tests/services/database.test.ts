import MongoClient from "mongodb";
import { Answer, Question, User } from "src/models";

import {
  initDb,
  closeDb,
  getDb,
  getCollection,
} from "../../src/services/database";

describe("Initialise database", () => {
  afterAll(async (done) => {
    await closeDb();
    done();
  });

  it("should not throw error", async () => {
    await expect(initDb()).resolves.toBeUndefined();
  });

  it("should allow initialising with warning even if database is already initialised", async () => {
    console.warn = jest.fn();
    await expect(initDb()).resolves.toBeUndefined();
    await expect(initDb()).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("Close database", () => {
  it("should not throw error", async () => {
    await expect(closeDb()).resolves.toBeUndefined();
  });

  it("should allow closing with warning even if database is not initialised", async () => {
    console.warn = jest.fn();
    await expect(closeDb()).resolves.toBeUndefined();
    await expect(closeDb()).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("Get database", () => {
  beforeAll(async (done) => {
    await initDb();
    done();
  });

  afterAll(async (done) => {
    await closeDb();
    done();
  });

  it("should return the database instance if initialised", async () => {
    const db = getDb();

    expect(db).toBeInstanceOf(MongoClient.Db);
  });

  it("should return the same database instance if initialised", async () => {
    const db1 = getDb();
    const db2 = getDb();

    expect(db1).toBe(db2);
  });

  it("should throw assertion error if database is not yet initialised", async () => {
    await closeDb();

    expect(getDb).toThrowError();
  });
});

describe("Get questions collection", () => {
  beforeAll(async (done) => {
    await initDb();
    done();
  });

  afterAll(async (done) => {
    await closeDb();
    done();
  });

  it("should return questions collection", async () => {
    const questionsCollection = getCollection<Question>("questions");
    expect(questionsCollection.collectionName).toBe("questions");
  });

  it("should throw error if database is not yet initialised", async () => {
    await closeDb();

    expect(getCollection).toThrowError();
  });
});

describe("Get answers collection", () => {
  beforeAll(async (done) => {
    await initDb();
    done();
  });

  afterAll(async (done) => {
    await closeDb();
    done();
  });

  it("should return answers collection", async () => {
    const answersCollection = getCollection<Answer>("answers");
    expect(answersCollection.collectionName).toBe("answers");
  });

  it("should throw error if database is not yet initialised", async () => {
    await closeDb();

    expect(getCollection).toThrowError();
  });
});

describe("Get users collection", () => {
  beforeAll(async (done) => {
    await initDb();
    done();
  });

  afterAll(async (done) => {
    await closeDb();
    done();
  });

  it("should return users collection", async () => {
    const usersCollection = getCollection<User>("users");
    expect(usersCollection.collectionName).toBe("users");
  });

  it("should throw error if database is not yet initialised", async () => {
    await closeDb();

    expect(getCollection).toThrowError();
  });
});
