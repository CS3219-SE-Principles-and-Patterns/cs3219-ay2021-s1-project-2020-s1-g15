<!-- omit in toc -->
# AnswerLeh

<!-- omit in toc -->
## TOC

- [Client](#client)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Development Notes](#development-notes)
    - [Pages](#pages)
    - [Question Page ( located in `pages/question` folder )](#question-page--located-in-pagesquestion-folder-)
  - [Development environment](#development-environment)
- [Server](#server)
  - [Prerequisites](#prerequisites-1)
    - [Installing](#installing-1)
    - [Set up Firebase Admin SDK](#set-up-firebase-admin-sdk)
  - [Development environment](#development-environment-1)
    - [Start developing](#start-developing)
    - [Access local endpoints](#access-local-endpoints)
    - [Bypass Firebase Auth for dev and test environment](#bypass-firebase-auth-for-dev-and-test-environment)
    - [Lint and run tests](#lint-and-run-tests)
- [API reference](#api-reference)
  - [Authenticated routes](#authenticated-routes)
  - [Users](#users)
    - [Register and create a user](#register-and-create-a-user)
    - [Get all questions created by a user](#get-all-questions-created-by-a-user)
    - [Get all answers created by a user](#get-all-answers-created-by-a-user)
  - [Questions](#questions)
    - [Create a question](#create-a-question)
    - [Get all questions](#get-all-questions)
    - [Get a specific question](#get-a-specific-question)
    - [check a question vote status](#check-a-question-vote-status)
    - [Upvote a question](#upvote-a-question)
    - [Downvote a question](#downvote-a-question)
    - [Update a question](#update-a-question)
    - [Delete a question](#delete-a-question)
  - [Answers](#answers)
    - [Create an answer](#create-an-answer)
    - [Get all answers by question ID](#get-all-answers-by-question-id)
    - [Check answers vote status](#check-answers-vote-status)
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

### Development Notes 

#### Pages 

Currently each folder name corresponds to the url e.g `question` folder will be `base_url/question/`
- forum
- login 
- register
- user 

Route constants can be found in `util/routes.ts`

#### Question Page ( located in `pages/question` folder )

- `[qid].tsx` page that presents a single question
  - url params : `qid`
  - Fetches question based on the url params

- `ask.tsx` page that represents the creation / editing of a single question
  - url params : `qid`
  - Fetches qid based on url params (if presence)
  - if creating, qid is set to null

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

#### Installing

The following are required to be installed:

- [MongoDB](https://www.mongodb.com/)
- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

```sh
# change to server/ directory first
cd server/
# install all dependencies
yarn
```

#### Set up Firebase Admin SDK

This project requires the use of GCP and Firebase resources. In order to develop locally with Firebase Authentication:

1. Head to the [Firebase console to generate a private key for a service account](https://console.firebase.google.com/project/answerleh/settings/serviceaccounts/adminsdk)
2. Rename that file to exactly `firebase-adminsdk.json`
3. Place it in the `/server` directory (same level where the `Dockerfile` is present)
4. Git should already ignore `firebase-adminsdk.json` by default

This private key allows **full access** to this project's Firebase resources. **Treat it as you would a password and do not commit this file or otherwise leak it**.

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

#### Bypass Firebase Auth for dev and test environment

When running tests and developing locally, you may want to bypass Firebase Auth for your convenience:

```sh
# change to server/ directory first
cd server/
# start a local server with hot reload at port 8000 and bypass firebase auth
yarn dev:bypass-auth
```

When developing with this command, the [middleware responsible for authentication](https://github.com/CS3219-SE-Principles-and-Patterns/cs3219-ay2021-s1-project-2020-s1-g15/blob/master/server/src/middlewares/authRouteHandler.ts) will:

- Ignore and skip the verification of the token in the `Authorization` request headers (if any)
- Always store in `res.locals.uid` the `uid` of `devtestuser@answerleh.com` (`5f84521e8facd089df29b7a9`), for use by the next route

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

### Authenticated routes

All authenticated routes require the use of a Firebase token to be present in the `Authorization` headers in the request. An example header:

```http
Authorization: Bearer <FIREBASE_TOKEN>
```

- Replace `<FIREBASE_TOKEN>` with the actual token after authenticating with Firebase Auth
- Make sure that the keyword `Bearer` and a single whitespace is prepended to the token before sending it to the server

### Users

#### Register and create a user

- Method: `POST`
- URL: `/api/users`
- Auth required: NO
- Body data (example):
  ```js
  {
    "email": "yo@answerleh.com", // string; required!
    "password": "123456", // string; required!
  }
  ```

**Success response**:

- Condition: if all required fields are present and valid
- Code: `201 CREATED`
- Content (example):
  ```js
  {
    "_id": "5f84521e8facd089df29b7a9",
    "createdAt": "2020-10-12T12:54:55.874Z",
    "updatedAt": "2020-10-12T12:54:55.874Z",
    "email": "devtestuser@answerleh.com",
    "username": "devtestuser@answerleh.com",
    "questionIds": [],
    "answerIds": []
  }
  ```

**Error response**:

- Condition: if any required fields are missing or invalid
- Status: `400 BAD REQUEST`
- Content: description of error

#### Get all questions created by a user

- Method: `GET`
- URL: `/api/users/:id/questions`
- URL parameters:
  - `id`: the `ObjectId` of the user
- Auth required: NO

**Success response**:

- Condition: if user exists
- Code: `200 OK`
- Content (example):
  ```js
  [ 
    //...
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
    //...
  ]
  ```

**Error response**:

- Condition: if `id` is not a valid `ObjectId`
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if user does not exist
- Status: `404 NOT FOUND`
- Content: description of error

#### Get all answers created by a user

- Method: `GET`
- URL: `/api/users/:id/answers`
- URL parameters:
  - `id`: the `ObjectId` of the user
- Auth required: NO

**Success response**:

- Condition: if user exists
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

- Condition: if `id` is not a valid `ObjectId`
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if user does not exist
- Status: `404 NOT FOUND`
- Content: description of error

### Questions

#### Create a question

- Method: `POST`
- URL: `/api/questions`
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
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

- Condition: if user is authenticated, and all fields are valid
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

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

- Condition: if any required fields are missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

#### Get all questions

- Method: `GET`
- URL: `/api/questions`
- Auth required: NO
- param data (example):
  ```js
  {
    "page": "1" // string: required
    "pageSize": "10" // string: required
  }
  ```

**Success response**:

- Condition: if everything is OK
- Code: `200 OK`
- Content (example):
  ```js
  {
    "questions" :
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
      ],
    "total": 15
  }
  ```

#### Get a specific question

- Method: `GET`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Auth required: NO

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

#### check a question vote status

- Method: `GET`
- URL: `/api/questions/:id/vote-status`
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`

#### Upvote a question

- Method: `PUT`
- URL: `/api/questions/:id/upvote`
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
- Content (example):
  ```js
  {
    command: "insert" | "remove" // string | required
  }
  ```
#### Downvote a question

- Method: `PUT`
- URL: `/api/questions/:id/downvote`
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
- Content (example):
  ```js
  {
    command: "insert" | "remove" // string | required
  }
  ```

#### Update a question

- Method: `PUT`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
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

- Condition: if user is authenticated, question exists, and all required fields are present
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

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

- Condition: if `id` is not a valid `ObjectId`, or if any required fields are missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if question does not exist, or if question does not belong to the user
- Status: `404 NOT FOUND`
- Content: description of error

#### Delete a question

- Method: `DELETE`
- URL: `/api/questions/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`

**Success response**:

- Condition: if user is authenticated, the question exists and is deleted successfully
- Code: `204 NO CONTENT`

**Error response**:

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

- Condition: if question does not exist, or if question does not belong to the user
- Code: `404 NOT FOUND`
- Content: description of error

### Answers

#### Create an answer

- Method: `POST`
- URL: `/api/answers`
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
- Body data (example):
  ```js
  {
    "questionId": "5f570273a83adf5417b48026", // ObjectId of question; required!
    "markdown": "hello" // string; required!
  }
  ```

**Success response**:

- Condition: if user is authenticated, and the `markdown` field is valid
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

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

- Condition: if `markdown` field is missing or the empty string
- Status: `400 BAD REQUEST`
- Content: description of error

OR

- Condition: if question (`questionId`) is not found
- Status: `404 NOT FOUND`
- Content: description of error

#### Get all answers by question ID

- Method: `GET`
- URL: `/api/answers?questionId=<qid>`
- URL query
  - `<qid>`: the `ObjectId` of the question
- Auth required: NO

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

#### Check answers vote status

- Method: `GET`
- URL: `/api/answers/vote-status?answerIds=<aid>&answerIds=<aid>&...`
- URL query
  - `<aid>`: the `ObjectId` of the answer
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`

**Success response**:

- Condition: if everything is OK
- Code: `200 OK`
- Content (example):
  ```js
  {
    "5f7d327766aa52759df235ff": {
        "isUpvote": true,
        "isDownvote": false
    },
    "5f7d327766aa52759df235f1": {
        "isUpvote": false,
        "isDownvote": true
    }
  }
  ```

#### Update an answer

- Method: `PUT`
- URL: `/api/answers/:id`
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`
- Body data (example):
  ```js
  {
    "markdown": "updated" // string; required!
  }
  ```

**Success response**:

- Condition: if user is authenticated, answer exists, and the `markdown` field is valid
- Code: `200 OK`
- Content (example):
  ```js
  {
    "_id": "5f82ef78bef85211fd9fb314",
    "markdown": "updated",
    "questionId": "5f570273a83adf5417b48026",
    "createdAt": "2020-09-08T04:02:59.081Z",
    "updatedAt": "2020-09-08T09:03:21.081Z",
    "userId": "5f82feda42ace23941434007",
    "upvotes": 0,
    "downvotes": 0
  },
  ```

**Error response**:

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

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
- URL parameters:
  - `id`: the `ObjectId` of the MongoDB document
- Auth required: YES
- Headers: `Authorization: Bearer <FIREBASE_TOKEN>`

**Success response**:

- Condition: if the answer exists and is deleted successfully
- Code: `204 NO CONTENT`

**Error response**:

- Condition: if the user authentication failed for any reason
- Status: `401 UNAUTHORIZED`
- Content: description of error

OR

- Condition: if answer does not exist
- Code: `404 NOT FOUND`
- Content: description of error
