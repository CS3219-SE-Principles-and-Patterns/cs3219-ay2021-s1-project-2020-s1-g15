const withAntdLess = require("next-plugin-antd-less");

// see: https://github.com/vercel/next-plugins/issues/598
// see: https://github.com/vercel/next.js/issues/8156#issuecomment-516009764
// fix issue with next-plugin-antd-less
module.exports = withAntdLess({
  lessVarsFilePath: "./pages/antd.less",
  env: {
    baseUrlDev: "http://localhost:8000/api/",
  },
  basePath: "",
  experimental: {
    modern: false,
    plugins: false,
    profiling: true,
    sprFlushToDisk: true,
    reactMode: "legacy",
    workerThreads: false,
    pageEnv: false,
    productionBrowserSourceMaps: false,
    optimizeFonts: true,
    optimizeImages: false,
    scrollRestoration: false,
    i18n: false,
  },
  cssModules: true,
  cssLoaderOptions: {
    javascriptEnabled: true,
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
});

/*
// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    })
  ),
});*/
