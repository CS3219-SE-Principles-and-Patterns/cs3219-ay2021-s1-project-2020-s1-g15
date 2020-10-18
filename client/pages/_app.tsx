import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import "style/antd.less";
import "style/app.css";
import "style/global.css";
import "style/markdown.css";

import React, { useState } from "react";
import { Router } from "next/router";
import { Spin } from "antd";

import { AuthProvider } from "components/authentication";
import auth from "config/firebase.config";

const App = ({ Component, pageProps }) => {
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

export default App;
