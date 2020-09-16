# AnswerLeh Server

## Project structure

```sh
# main source code
src/
├── index.ts     # main entry point
├── controllers/ # business logic for the API endpoints
│   └── questions.ts
├── models/
│   └── Question.ts
├── routes/      # API endpoints
│   └── questions.ts
└── services/    # miscellaneous services from other packages
    ├── database.ts
    └── server.ts
# source code for tests; should mirror src/ structure
tests/
├── index.test.ts
├── routes/
│   └── questions.test.ts
└── services/
    └── database.test.ts
```

## Installing

1. Make sure you are in the `server/` directory
2. Install all dependencies by running `yarn`
3. Install [MongoDB](https://www.mongodb.com/) on your machine

## Developing

1. Make sure MongoDB is running on your machine
2. Start local server with hot reload by running `yarn dev`

## Testing

1. Run `yarn ci` to lint all files, run all tests, and generate coverage report

## Deploying

TODO
