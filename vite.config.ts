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
// the mdx plugin is used to compile mdx files but only the about page at the momement. If I remove the mdx plugin then the about page will not work but the mdx-bundler
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
