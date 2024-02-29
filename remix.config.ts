/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
   postcss: true,
  serverModuleFormat: "esm",
serverDependenciesToBundle: [/^remix-utils.*/,/^remix-auth-totp.*/],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {

  },
};
