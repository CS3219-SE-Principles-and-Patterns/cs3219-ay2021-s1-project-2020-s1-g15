import "dotenv/config"; // make sure this is at the top

import app from "./services/server";
import { initDb } from "./services/database";
import { initAuth } from "./services/authentication";

const port: string = process.env.PORT || "8000";

// IIFE to use async await syntax
(async () => {
  // init Firebase Auth:
  await initAuth();
  // init MongoDB:
  await initDb();
  // init Express:
  app.listen(port, () => {
    console.log(`Express: started listening at port ${port}`);
  });
})();
