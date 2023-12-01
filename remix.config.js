/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  tailwind:true,
  serverModuleFormat: "cjs",
    serverDependenciesToBundle: [/^remix-utils.*/],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
    v2_dev:true,
  future: {
   
  },
};
