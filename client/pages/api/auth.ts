import auth from "../firebase.config";

// one workaround for this would be to have the FE api layer do the authentication with firebase
// then my user just sent to this endpoint.
export default function handler(req, res) {
  if (req.method == "POST") {
    console.log("serveer");
    console.log(req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ name: "test" }));
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ auth }));
}
