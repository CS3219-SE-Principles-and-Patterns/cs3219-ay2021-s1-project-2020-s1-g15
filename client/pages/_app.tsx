import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import NProgress from "nprogress";
import Router from "next/router";

import "./antd.less";
import "./app.css";

import { AuthProvider } from "../components/authentication";
import auth from "./firebase.config";
import { useEffect, useState } from "react";
//TODO: loading page
//Binding events.
/*
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
*/
// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }) => {
  /*
  const [auth, setAuth] = useState();
  useEffect(() => {
    const getAuth = async () => {
      const res = await fetch("/api/auth", {
        method: "GET",
        headers: new Headers({}),
        credentials: "same-origin",
      });
      console.log(res);
      const { auth } = await res.json();
      // this auth is returning json
      setAuth(auth);
    };
    getAuth();
  }, []);
       */
  return (
    <AuthProvider auth={auth}>
      <Component {...pageProps} />
    </AuthProvider>
  );
};
/*
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = fetch("/api/auth", {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
  }).then((res) => res.json());

  // Pass data to the page via props
  return { props: { auth: data } };
}*/

export default MyApp;
