import { NextApiRequest, NextApiResponse } from "next";
import auth from "../firebase.config";

// one workaround for this would be to have the FE api layer do the authentication with firebase
// then my user just sent to this endpoint.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      console.log("serveer");
      console.log(req.body);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ name: "test" }));

    case "PUT":
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ auth }));
  }
}
