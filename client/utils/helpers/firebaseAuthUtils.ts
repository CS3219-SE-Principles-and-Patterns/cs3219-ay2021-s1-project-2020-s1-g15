import { useState, useEffect } from "react";

import auth from "config/firebase.config";

async function login(email: string, password: string) {
  return auth.signInWithEmailAndPassword(email, password);
}

async function logout() {
  return auth.signOut();
}

async function getCurrentFirebaseUser(): Promise<firebase.User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      unsubscribe();
      resolve(authUser);
    });
  });
}

function useFirebaseAuthentication(): firebase.User | null {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setFirebaseUser(authUser);
    });
    return () => {
      unsubscribe();
    };
  });

  return firebaseUser;
}

export { login, logout, getCurrentFirebaseUser, useFirebaseAuthentication };
