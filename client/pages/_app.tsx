import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import "styles/antd.less";
import "styles/app.css";
import "styles/global.css";
import "styles/markdown.css";

import React, { useState } from "react";
import { Router } from "next/router";
import { Spin } from "antd";

import { AuthProvider } from "components/authentication";

const App = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState<boolean>(false);
  Router.events.on("routeChangeStart", (_) => {
    // this callback here we can access the route endpoint, but i cannot call isAuthenticated in here
    //  unless i store inside cookies or have a way to check on route change
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", () => setLoading(false));
  Router.events.on("routeChangeError", () => setLoading(false));
  return (
    <AuthProvider>
      <Spin spinning={loading} tip={"Loading..."}>
        <Component {...pageProps} />
      </Spin>
    </AuthProvider>
  );
};

export default App;
