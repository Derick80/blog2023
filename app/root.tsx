import { LinksFunction, LoaderArgs, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { isAuthenticated } from './server/auth/auth.server'
import Layout from './components/layout'
import stylesheet from "~/tailwind.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];


export async function loader({request}:LoaderArgs){
  const user = await isAuthenticated(request)
  return json({user})
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
      <body
        className=''
      >
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
