import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import NProgress from "nprogress";

import "./antd.less";
import "./app.css";

import { AuthProvider } from "../components/authentication";
import auth from "./firebase.config";
import React, { useState } from "react";
import { Router } from "next/router";
import { Spin } from "antd";

//TODO: loading page
//Binding events.

// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState<boolean>(false);
  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeComplete", () => setLoading(false));
  Router.events.on("routeChangeError", () => setLoading(false));

  return (
    <AuthProvider auth={auth}>
      <Spin spinning={loading} tip={"Loading..."}>
        <Component {...pageProps} />
      </Spin>
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
