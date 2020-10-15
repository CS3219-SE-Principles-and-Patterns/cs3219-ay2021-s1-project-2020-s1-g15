import assert from "assert";

const getNodeEnv: () => string = () => {
  assert(process.env.NODE_ENV != null, "NODE_ENV not set");
  return process.env.NODE_ENV;
};
const isDevEnv: () => boolean = () => getNodeEnv() === "dev";
const isTestEnv: () => boolean = () => getNodeEnv() === "test";
const isProdEnv: () => boolean = () => getNodeEnv() === "prod";

const shouldBypassAuth: () => boolean = () =>
  process.env.BYPASS_AUTH === "true";

const getMongoDbName: () => string = () =>
  `answerleh-${getNodeEnv().toUpperCase()}`;
const getMongoDbUrl: () => string = () => {
  if (isTestEnv()) {
    const shelfJestMongoDbUrl = process.env.MONGO_URL; // helper env from @shelf/jest-mongodb
    assert(shelfJestMongoDbUrl != null, "MONGO_URL not set for test");
    return shelfJestMongoDbUrl;
  } else if (isDevEnv()) {
    return `mongodb://localhost:27017/${getMongoDbName()}`;
  } else if (isProdEnv()) {
    return "error, not implemented"; // TODO
  }
  assert(false);
};

export {
  isDevEnv,
  isTestEnv,
  isProdEnv,
  shouldBypassAuth,
  getMongoDbName,
  getMongoDbUrl,
};
