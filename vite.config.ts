import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import {flatRoutes} from 'remix-flat-routes'
import tsconfigPaths from 'vite-tsconfig-paths'
import { remixDevTools } from "remix-development-tools";
import mdx from "@mdx-js/rollup";
import rehypePrettyCode  from 'rehype-pretty-code'
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

installGlobals()

export default defineConfig({
  server: {
    port:6236
  },

  plugins: [mdx({

remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
    ],
    rehypePlugins: [
rehypePrettyCode
    ],
  }),remixDevTools(), remix({
ignoredRouteFiles:['**/*.css'],
    routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
  }), tsconfigPaths()],

})
