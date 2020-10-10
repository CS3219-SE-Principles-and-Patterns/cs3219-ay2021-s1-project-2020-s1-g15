import * as fs from "fs";
import * as path from "path";
import * as admin from "firebase-admin";

/**
 * Returns the Firebase Admin credentials for local development.
 *
 * Requires the "firebase-adminsdk.json" secret to be located within
 * the /server directory.
 */
async function getServiceAccountCredential(): Promise<
  admin.credential.Credential
> {
  if (process.env.NODE_ENV !== "dev") {
    throw new Error(
      "This function should only be called when developing locally!"
    );
  }

  const pathToSdk = path.join(__dirname, "..", "..", "firebase-adminsdk.json");
  const jsonFile = fs.readFileSync(pathToSdk, "utf8");
  const serviceAccount = JSON.parse(jsonFile);

  return admin.credential.cert({
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    projectId: serviceAccount.project_id,
  });
}

async function initAuth(): Promise<void> {
  const credential =
    process.env.NODE_ENV === "dev"
      ? await getServiceAccountCredential()
      : admin.credential.applicationDefault();

  admin.initializeApp({
    credential,
  });
}

function getAuth(): admin.auth.Auth {
  return admin.auth();
}

export { initAuth, getAuth };
