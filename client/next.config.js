module.exports = {
  env: {
    baseUrlDev: 'http://localhost:8000/api/',
  },
  basePath: '',
  experimental: {
    modern: false,
    plugins: false,
    profiling: true,
    sprFlushToDisk: true,
    reactMode: 'legacy',
    workerThreads: false,
    pageEnv: false,
    productionBrowserSourceMaps: false,
    optimizeFonts: true,
    optimizeImages: false,
    scrollRestoration: false,
    i18n: false,
  },
}
