import { LinksFunction, LoaderArgs } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from './tailwind.css'
import { isAuthenticated } from './server/auth/auth.server'
import Layout from './components/layout'
export const links: LinksFunction = ()=>[
  {
    rel: 'stylesheet', href:styles
  }
]


export async function loader({request}:LoaderArgs){
  return ({user: isAuthenticated(request)})
}
export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
       <Layout>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
       </Layout>
      </body>
    </html>
  );
}
