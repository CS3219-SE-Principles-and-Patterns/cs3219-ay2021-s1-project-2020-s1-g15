import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
} from "react";

import { Spin } from "antd";
import { User } from "../../util";
import { getSingleUser } from "../api";
type props = {
  auth: firebase.auth.Auth;
  children: React.ReactNode;
};

type AuthContextType = {
  firebaseUser?: firebase.User;
  user?: User;
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout?: () => Promise<void>;
  getIdToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: undefined,
  user: undefined,
  isAuthenticated: true,
  loading: false,
  getIdToken: () => new Promise(() => console.log("test")),
});

export const AuthProvider: FC<props> = ({ auth, children }) => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onAuthStateChange = (
      callback: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      setLoading(true);
      return auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          const user: User = await getSingleUser(firebaseUser.uid);
          setUser(user);
          setFirebaseUser(firebaseUser);
          callback(true);
        } else {
          callback(false);
        }
        setLoading(false);
      });
    };
    const unsubscribe = onAuthStateChange(setIsAuthenticated);
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const login = async (email: string, password: string) => {
    const credential = await auth.signInWithEmailAndPassword(email, password);

    setIsAuthenticated(true);
    return credential;
  };

  const logout = async () => {
    await auth.signOut();
    //setUser();
    setIsAuthenticated(false);
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
  const context = useContext(AuthContext);

  return context;
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
