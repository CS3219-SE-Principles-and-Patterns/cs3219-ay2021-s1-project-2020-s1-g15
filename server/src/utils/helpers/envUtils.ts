import assert from "assert";

const getNodeEnv: () => string = () => {
  assert(process.env.NODE_ENV !== undefined, "NODE_ENV not set");
  return process.env.NODE_ENV;
};
const isDevEnv: () => boolean = () => getNodeEnv() === "dev";
const isTestEnv: () => boolean = () => getNodeEnv() === "test";
const isProdEnv: () => boolean = () => getNodeEnv() === "prod";

const shouldBypassAuth: () => boolean = () => {
  assert(!isProdEnv(), "Bypass auth should not be called in prod!");
  return process.env.BYPASS_AUTH === "true";
};

const getMongoDbName: () => string = () =>
  `answerleh-${getNodeEnv().toUpperCase()}`;
const getMongoDbUrl: () => string = () => {
  if (isTestEnv()) {
    const shelfJestMongoDbUrl = process.env.MONGO_URL; // helper env from @shelf/jest-mongodb
    assert(shelfJestMongoDbUrl !== undefined, "MONGO_URL not set for test");
    return shelfJestMongoDbUrl;
  } else if (isDevEnv()) {
    return `mongodb://localhost:27017/${getMongoDbName()}`;
  } else if (isProdEnv()) {
    return "error, not implemented"; // TODO
  }
  // code should never reach here since either one of the 3 env must be set
  assert(false);
};

export {
  getNodeEnv,
  isDevEnv,
  isTestEnv,
  isProdEnv,
  shouldBypassAuth,
  getMongoDbName,
  getMongoDbUrl,
};
