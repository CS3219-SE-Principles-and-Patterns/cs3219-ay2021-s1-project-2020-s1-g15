import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
} from "react";
import { Spin } from "antd";

import {
  User,
  getSingleUser,
  login,
  logout,
  getIdToken,
  useFirebaseAuthentication,
} from "utils/index";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthContextType = {
  firebaseUser: firebase.User | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: typeof login;
  logout: typeof logout;
  getIdToken: typeof getIdToken;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login,
  logout,
  getIdToken,
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const firebaseUser: firebase.User | null = useFirebaseAuthentication();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const user: User | null =
        firebaseUser !== null ? await getSingleUser(firebaseUser.uid) : null;
      setUser(user);
      setIsAuthenticated(user !== null);
      setIsLoading(false);
    })();
  }, [firebaseUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        firebaseUser,
        user,
        isLoading,
        login,
        logout,
        getIdToken,
      }}
    >
      <Spin spinning={isLoading}>{children}</Spin>
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
