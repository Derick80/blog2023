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
import { ToastMessage, commitSession, getSession } from './server/auth/session.server'
import React from 'react'
import { Toaster, toast } from "react-hot-toast";
import { prisma } from './server/auth/prisma.server'
import { User, UserType } from './user-schema'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];


export async function loader({request}:LoaderArgs){
  const session = await getSession(request.headers.get('Cookie'))


  const toastMessage =await session.get("toastMessage") as ToastMessage

  if (!toastMessage) {
    return json({ toastMessage: null })
  }

  if (!toastMessage.type) {
    throw new Error("Message should have a type")
  }

  const user = await isAuthenticated(request)




  return json(
    { toastMessage,session,user },
  )
}
export default function App() {
  const data = useLoaderData()
const {toastMessage} = data

  React.useEffect(() => {
    if (!toastMessage) {
      return
    }
    const { message, type } = toastMessage

    switch (type) {
      case "success":
        toast.success(message)
        break
      case "error":
        toast.error(message)
        break
      default:
        throw new Error(`${type} is not handled`)
    }
  }, [toastMessage]);





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
          <Outlet

          />
          <Toaster />

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
       </Layout>
      </body>
    </html>
  );
}
