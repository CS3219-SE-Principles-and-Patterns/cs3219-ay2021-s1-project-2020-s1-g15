<!-- omit in toc -->
# AnswerLeh

<!-- omit in toc -->
## TOC

- [Client](#client)
- [Server](#server)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Development environment](#development-environment)
    - [Start developing](#start-developing)
    - [Access local endpoints](#access-local-endpoints)
    - [Lint and run tests](#lint-and-run-tests)

## Client

## Server

### Prerequisites

The following are required to be installed:

- [MongoDB](https://www.mongodb.com/)
- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Installing

```sh
# change to server/ directory first
cd server/
# install all dependencies
yarn
```

### Development environment

#### Start developing

Make sure you have [MongoDB](https://www.mongodb.com/) installed and running properly on your machine first!

```sh
# change to server/ directory first
cd server/
# start a local server with hot reload at port 8000
yarn dev
```

While developing locally, the local MongoDB server is used:

- URL: `mongodb://localhost:27017`
- Database name: `answerleh-DEV`

If there are any errors while connecting to your local MongoDB server, ensure that it is actually running first, or use a GUI like [MongoDB Compass](https://www.mongodb.com/products/compass) to verify that you are able to connect to the above URL.

#### Access local endpoints

1. Verify that the server has started and is listening on `http://localhost:8000`
2. Using Postman (or `curl`), make a `GET` call to `http://localhost:8000/api/questions` to verify that the endpoint is working

#### Lint and run tests

[ESLint](https://eslint.org/) with the [Prettier plugin](https://prettier.io/) is used to lint the source code, while [Jest](https://jestjs.io/) is used as the testing framework. To lint and run all tests:

```sh
# change to server/ directory first
cd server/
# lint and run all tests
yarn ci # similar to "yarn lint && yarn test"
# to only run lint
yarn lint
# to only run tests
yarn test
```

While running tests (`yarn test`), an in-memory version of MongoDB is used (see [`@shelf/jest-mongodb`](https://github.com/shelfio/jest-mongodb)). All reads and writes are performed using an ephemeral database which will not persist beyond the tests.
