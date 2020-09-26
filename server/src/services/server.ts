import "express-async-errors";
import express, { Express, Router } from "express";
import cors from "cors";

import customErrorHandler from "../middlewares/customErrorHandler";
import questionsRouter from "../routes/questions";

const app: Express = express();
const router: Router = express.Router();

// cors to allow for cross origin calls
app.use(cors());
// default express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// append `/api` prefix to all routes
app.use("/api", router);

// routes
router.use("/questions", questionsRouter);
// custom error handler: must be last middleware
app.use(customErrorHandler);

export default app;
