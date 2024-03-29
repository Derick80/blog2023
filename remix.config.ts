import { promise, string } from 'zod';

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  serverModuleFormat: "esm",
  serverDependenciesToBundle: [/^remix-utils.*/, /^remix-auth-totp.*/,],
  browserNodeBuiltinsPolyfill: {
    modules: {
      module: true,
      util: true,
      path: true,
      crypto: true,
      asserts: true,
      stream: true,
      fs: true,
      promise: true,
      string_decoder: true,
      os: true,
      child_process: true,
      buffer: true,
      tty: true,
      worker_threads: true,
  }
}
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",

};
