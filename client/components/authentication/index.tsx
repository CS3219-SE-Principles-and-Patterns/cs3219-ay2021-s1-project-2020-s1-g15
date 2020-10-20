import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
} from "react";
import { Spin } from "antd";

import { User, getSingleUser } from "../../utils";

type AuthProviderProps = {
  auth: firebase.auth.Auth;
  children: React.ReactNode;
};

type AuthContextType = {
  firebaseUser: firebase.User | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login?: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout?: () => Promise<void>;
  getIdToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  getIdToken: () => new Promise(() => console.log("test")),
});

export const AuthProvider: FC<AuthProviderProps> = ({ auth, children }) => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onAuthStateChange = (
      callback: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      return auth.onAuthStateChanged(async (firebaseUser) => {
        setLoading(true);
        setFirebaseUser(firebaseUser);
        setUser(firebaseUser ? await getSingleUser(firebaseUser.uid) : null);

        const isAuthenticated = firebaseUser !== null;
        setIsAuthenticated(isAuthenticated);
        callback(isAuthenticated);
        setLoading(false);
      });
    };
    const unsubscribe = onAuthStateChange(setIsAuthenticated);
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const login = async (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    return auth.signOut();
  };

  const getIdToken = async () => {
    const userInstance: firebase.User | null = await auth.currentUser;
    if (userInstance != null) {
      const idToken = userInstance.getIdToken(/* forceRefresh */ true);
      return idToken;
    } else {
      return "NULL";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        firebaseUser,
        user,
        loading,
        login,
        logout,
        getIdToken,
      }}
    >
      <Spin spinning={loading}>{children}</Spin>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext<AuthContextType>(AuthContext);
};
/*
https://medium.com/@tafka_labs/auth-redirect-in-nextjs-3a3a524c0a06
export const ProtectRoute:  = ({ Component: Component, ...rest }) => {
  return () => {
    const { firebaseUser, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push("/login");
    }, [loading, isAuthenticated]);

    return <Component {...rest} />;
  };
};
*/
