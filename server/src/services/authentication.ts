import * as admin from "firebase-admin";

async function initAuth(): Promise<void> {
  // assume we are prod:
  let credential = admin.credential.applicationDefault();

  if (process.env.NODE_ENV === "dev") {
    const serviceAccount = await import("../../firebase-adminsdk.json");

    credential = admin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    });
  }

  admin.initializeApp({
    credential,
  });
}

function getAuth(): admin.auth.Auth {
  return admin.auth();
}

export { initAuth, getAuth };
