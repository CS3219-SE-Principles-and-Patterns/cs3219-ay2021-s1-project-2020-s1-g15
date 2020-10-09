/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import React, { createContext, useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";

type AuthContextType = {
  user: {};
  isAuthenticated: boolean;
  loading: boolean;
  login?: Promise<void>;
  logout?: Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: {},
  isAuthenticated: true,
  loading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = async (email, password) => {
    /*
    const { data: token } = await api.post('auth/login', { email, password })

    if (token) {
      console.log('Got token')
      Cookies.set('token', token, { expires: 60 })
      api.defaults.headers.Authorization = `Bearer ${token.token}`
      const { data: user } = await api.get('users/me')
      setUser(user)
      console.log('Got user', user)
    }*/
  };

  const logout = (email: string, password: string) => {
    /*
    Cookies.remove('token')
    setUser(null)
    window.location.pathname = '/login'*/
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: false, user, login, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export const ProtectRoute = ({ Component: Component, ...rest }) => {
  return () => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push("/login");
    }, [loading, isAuthenticated]);

    return <Component {...rest} />;
  };
};
