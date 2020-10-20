import assert from "assert";
import MongoClient, { Collection } from "mongodb";
import { Question, Answer, User, Vote } from "src/models";
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

function getVoteCollection(): Collection<Vote> {
  return getDb().collection("votes");
}

export {
  initDb,
  getDb,
  closeDb,
  getQuestionsCollection,
  getAnswersCollection,
  getUsersCollection,
  getVoteCollection,
};
