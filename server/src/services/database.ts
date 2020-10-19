import assert from "assert";
import MongoClient, { Collection } from "mongodb";

import { Question, Answer, User } from "../models";
import { getMongoDbName, getMongoDbUrl } from "../utils";

const mongoClient: MongoClient.MongoClient = new MongoClient.MongoClient(
  getMongoDbUrl(),
  {
    useUnifiedTopology: true,
  }
);

async function initDb(): Promise<void> {
  if (mongoClient.isConnected()) {
    console.warn(`MongoDB: ${getMongoDbName()} already connected`);
    return;
  }

  console.log(
    `MongoDB: connecting to ${getMongoDbName()} at ${getMongoDbUrl()}`
  );
  await mongoClient.connect();
  console.log(`MongoDB: successfully connected`);
}

function getDb(): MongoClient.Db {
  assert(mongoClient.isConnected(), "MongoDB: not yet initialised");
  return mongoClient.db();
}

async function closeDb(): Promise<void> {
  if (!mongoClient.isConnected()) {
    console.warn(`MongoDB: already disconnected`);
    return;
  }

  await mongoClient.close();
  console.log("MongoDB: connection closed");
}

function getQuestionsCollection(): Collection<Question> {
  return getDb().collection("questions");
}

function getAnswersCollection(): Collection<Answer> {
  return getDb().collection("answers");
}

function getUsersCollection(): Collection<User> {
  return getDb().collection("users");
}
// if this is ok then I will proceed to change the rest
type CollectionType<T> = T extends Question
  ? "questions"
  : T extends User
  ? "users"
  : T extends Answer
  ? "answers"
  : never;

function getCollection<T>(param: CollectionType<T>): Collection<T> {
  return getDb().collection<T>(param);
}

export {
  initDb,
  getDb,
  closeDb,
  getQuestionsCollection,
  getAnswersCollection,
  getUsersCollection,
  getCollection,
};
