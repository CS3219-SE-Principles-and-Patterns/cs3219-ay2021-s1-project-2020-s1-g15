// TODO: update .env with correct credentials
import "dotenv/config"; // make sure this is at the top

import app from "./services/server";
import { initDb } from "./services/database";
import { initAuth } from "./services/authentication";

const port: string = process.env.PORT || "8000";

initAuth();
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Express: started listening at port ${port}`);
  });
});
