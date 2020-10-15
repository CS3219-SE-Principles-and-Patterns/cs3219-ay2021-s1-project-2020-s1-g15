import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
} from "react";

import { Spin } from "antd";
import { User } from "../../util";

type props = {
  auth: firebase.auth.Auth;
  children: React.ReactNode;
};

type AuthContextType = {
  user?: {};
  isAuthenticated?: boolean;
  loading?: boolean;
  login?: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout?: () => Promise<void>;
  getIdToken?: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType>({
  user: {},
  isAuthenticated: true,
  loading: false,
});

export const AuthProvider: FC<props> = ({ auth, children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onAuthStateChange = (
      callback: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      setLoading(true);
      return auth.onAuthStateChanged((user) => {
        if (user) {
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
    // TODO: get user from BE-server
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
export const ProtectRoute:  = ({ Component: Component, ...rest }) => {
  return () => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push("/login");
    }, [loading, isAuthenticated]);

    return <Component {...rest} />;
  };
};
*/
