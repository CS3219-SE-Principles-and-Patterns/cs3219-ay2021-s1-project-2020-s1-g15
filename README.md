<!-- omit in toc -->
# AnswerLeh

<!-- omit in toc -->
## TOC

- [Client](#client)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Development environment](#development-environment)
- [Server](#server)
  - [Prerequisites](#prerequisites-1)
  - [Installing](#installing-1)
  - [Development environment](#development-environment-1)
    - [Start developing](#start-developing)
    - [Access local endpoints](#access-local-endpoints)
    - [Lint and run tests](#lint-and-run-tests)
- [API reference](#api-reference)
  - [Questions](#questions)
    - [Create a question](#create-a-question)
    - [Get all questions](#get-all-questions)
    - [Get a specific question](#get-a-specific-question)
    - [Update a question](#update-a-question)
    - [Delete a question](#delete-a-question)
  - [Answers](#answers)
    - [Create an answer](#create-an-answer)
    - [Get all answers by question ID](#get-all-answers-by-question-id)
    - [Update an answer](#update-an-answer)
    - [Delete an answer](#delete-an-answer)

## Client

### Prerequisites

The following are required to be installed:

- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Installing

```sh
# change to client / directory first
cd client/
# install all dependencies and next Js
yarn
```

### Development environment

```sh
# change to client / directory first
cd client/
# Runs in dev mode. This same as running next dev
yarn dev
```

The project should be hosted on [localhost:3000](localhost:3000).

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
3. Refer to the [API reference](#api-reference) for the other endpoints

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

## API reference

The following base URLs are assumed:

- **Deployed endpoint**: TODO
- **Local endpoint**: http://localhost:8000

### Questions

#### Create a question

- Method: `POST`
- URL: `/api/questions`
- Body data (example):
  ```js
  {
    "title": "How do I do this?", // string; required!
    "markdown": "hello", // string; required!
    "level": "primary", // string; required
    "subject": "mathematics" // string; required
  }
  ```

**Success response**:

- Condition: if everything is OK, and the `markdown` field is valid
- Code: `201 CREATED`
- Content (example):
  ```js
  {
    "_id": "5f7d327766aa52759df235ff",
    "createdAt": "2020-10-07T03:13:59.223Z",
    "updatedAt": "2020-10-07T03:13:59.223Z",
    "title": "How do I do this?",
    "slug": "how-do-i-do-this",
    "markdown": "hello",
    "userId": "5f7d327766aa52759df235fe",
    "answerIds": [],
    "level": "primary",
    "subject": "mathematics",
    "upvotes": 0,
    "downvotes": 0
  }
  ```

**Error response**:

- Condition: if any required fields are missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

#### Get all questions

- Method: `GET`
- URL: `/api/questions`

**Success response**:

- Condition: if everything is OK
- Code: `200 OK`
- Content (example):
  ```js
  [
    // ...
    {
      "_id": "5f7d327766aa52759df235ff",
      "createdAt": "2020-10-07T03:13:59.223Z",
      "updatedAt": "2020-10-07T03:13:59.223Z",
      "title": "How do I do this?",
      "slug": "how-do-i-do-this",
      "markdown": "hello",
      "userId": "5f7d327766aa52759df235fe",
      "answerIds": [],
      "level": "primary",
      "subject": "mathematics",
      "upvotes": 0,
      "downvotes": 0
    },
    // ...
  ]
  ```

#### Get a specific question

- Method: `GET`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document

**Success response**:

- Condition: if question exists
- Code: `200 OK`
- Content (example):
  ```js
  {
    "_id": "5f7d327766aa52759df235ff",
    "createdAt": "2020-10-07T03:13:59.223Z",
    "updatedAt": "2020-10-07T03:13:59.223Z",
    "title": "How do I do this?",
    "slug": "how-do-i-do-this",
    "markdown": "hello",
    "userId": "5f7d327766aa52759df235fe",
    "answerIds": [],
    "level": "primary",
    "subject": "mathematics",
    "upvotes": 0,
    "downvotes": 0
  }
  ```

**Error response**:

- Condition: if `id` is not a valid `ObjectId`
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if question does not exist
- Status: `404 NOT FOUND`
- Content: description of error

#### Update a question

- Method: `PUT`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Body data (example):
  ```js
  {
    "title": "I'm going to CHANGE the title!", // string; required!
    "markdown": "hello", // string; required!
    "level": "primary", // string; required
    "subject": "mathematics" // string; required
  }
  ```

**Success response**:

- Condition: if question exists, and all required fields are present
- Code: `200 OK`
- Content (example):
  ```js
  {
    "_id": "5f7d327766aa52759df235ff",
    "createdAt": "2020-10-07T03:13:59.223Z",
    "updatedAt": "2020-10-07T03:17:37.627Z",
    "title": "I'm going to CHANGE the title!",
    "slug": "im-going-to-change-the-title",
    "markdown": "hello",
    "userId": "5f7d327766aa52759df235fe",
    "answerIds": [],
    "level": "primary",
    "subject": "mathematics",
    "upvotes": 0,
    "downvotes": 0
  }
  ```

**Error response**:

- Condition: if `id` is not a valid `ObjectId`, or if any required fields are missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if question does not exist
- Status: `404 NOT FOUND`
- Content: description of error

#### Delete a question

- Method: `DELETE`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document

**Success response**:

- Condition: if the question exists and is deleted successfully
- Code: `204 NO CONTENT`

**Error response**:

- Condition: if question does not exist
- Code: `404 NOT FOUND`
- Content: description of error

### Answers

#### Create an answer

- Method: `POST`
- URL: `/api/answers`
- Body data (example):
  ```js
  {
    "questionId": "5f570273a83adf5417b48026", // ObjectId of question; required!
    "markdown": "hello" // string; required!
  }
  ```

**Success response**:

- Condition: if everything is OK, and the `markdown` field is valid
- Code: `201 CREATED`
- Content (example):
  ```js
  {
    "_id": "5f570273a83adf5417b48028",
    "markdown": "hello",
    "questionId": "5f570273a83adf5417b48026",
    "createdAt": "2020-09-08T04:02:59.081Z",
    "updatedAt": "2020-09-08T04:02:59.081Z",
    "userId": "5f82feda42ace23941434007",
    "upvotes": 0,
    "downvotes": 0
  }
  ```

**Error response**:

- Condition: if `markdown` field is missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if question (`questionId`) is not found
- Status: `404 NOT FOUND`
- Content: description of error

#### Get all answers by question ID

- Method: `GET`
- URL: `/api/answers`
- Body data (example):
  ```js
  {
    "questionId": "5f570273a83adf5417b48026" // ObjectId of question; required!
  }
  ```

**Success response**:

- Condition: if everything is OK
- Code: `200 OK`
- Content (example):
  ```js
  [
    // ...
    {
      "_id": "5f570273a83adf5417b48028",
      "markdown": "hello",
      "questionId": "5f570273a83adf5417b48026",
      "createdAt": "2020-09-08T04:02:59.081Z",
      "updatedAt": "2020-09-08T04:02:59.081Z",
      "userId": "5f82feda42ace23941434007",
      "upvotes": 0,
      "downvotes": 0
    },
    // ...
  ]
  ```

**Error response**:

- Condition: if question (`questionId`) is not found
- Status: `404 NOT FOUND`
- Content: description of error

#### Update an answer

- Method: `PUT`
- URL: `/api/answers/:id`
- URL parameters
  - `id`: the `ObjectId` of the MongoDB document
- Body data (example):
  ```js
  {
    "markdown": "updated" // string; required!
  }
  ```

**Success response**:

- Condition: if answer exists, and the `markdown` field is valid
- Code: `200 OK`
- Content (example):
  ```js
  {
    "_id": "5f570273a83adf5417b48026",
    "markdown": "updated",
    "questionId": "5f570273a83adf5417b48026",
    "createdAt": "2020-09-08T04:02:59.081Z",
    "updatedAt": "2020-09-08T09:03:21.081Z"
  },
  ```

**Error response**:

- Condition: if `id` is not valid, or if `markdown` field is missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if answer does not exist
- Status: `404 NOT FOUND`
- Content: description of error

#### Delete an answer

- Method: `DELETE`
- URL: `/api/answers/:id`
- URL parameters
  - `id`: the `ObjectId` of the MongoDB document

**Success response**:

- Condition: if the answer exists and is deleted successfully
- Code: `204 NO CONTENT`

**Error response**:

- Condition: if answer does not exist
- Code: `404 NOT FOUND`
- Content: description of error
