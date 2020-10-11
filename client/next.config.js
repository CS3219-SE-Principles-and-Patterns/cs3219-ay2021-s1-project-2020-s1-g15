const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
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
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    })
  ),
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
