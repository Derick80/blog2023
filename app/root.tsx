import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError
} from '@remix-run/react'
import { isAuthenticated } from './server/auth/auth.server'
import Layout from './components/layout/layout'
import stylesheet from '~/tailwind.css'
import type { ToastMessage } from './server/session.server'
import { commitSession, getSession } from './server/session.server'
import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { prisma } from './server/prisma.server'
import { AnimatePresence, motion } from 'framer-motion'
import { MetronomeLinks } from '@metronome-sh/react'
import { getEnv } from './server/env.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet, preload: 'true' }
]

// SEO  meta tags
export const meta: MetaFunction = () => {
  return [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },

    {
      title: `Derick's Remix Blog`
    }
  ]
}
// long story short I missed the if !toastMessage return so most of the time I was not returning my user because the message is blank.  This way, I think I'm able to use toast and also not have it refresh every time I navigate.
export async function loader ({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  const categories = await prisma.category.findMany()
  const session = await getSession(request.headers.get('Cookie'))
  const toastMessage = (await session.get('toastMessage')) as ToastMessage

  if (!toastMessage) {
    return json({ toastMessage: null, user, categories })
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type')
  }

  return json(
    { toastMessage, user, categories, ENV: getEnv() },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  )
}

export default function App () {
  const data = useLoaderData<typeof loader>()
  const { toastMessage } = data

  React.useEffect(() => {
    if (!toastMessage) {
      return
    }
    const { message, type } = toastMessage

    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      default:
        throw new Error(`${type} is not handled`)
    }
  }, [toastMessage])

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        <MetronomeLinks />
      </head>
      <body
        id='body'
        className='h-screen bg-primary text-slate-900  dark:text-violet3'
      >

        <Layout>
          <AnimatePresence mode='wait' initial={ false }>
            <motion.div
              key={ useLocation().pathname }
              animate={ { x: '90', opacity: 1 } }
              transition={ {
                duration: 0.25,
                type: 'spring',
                stiffness: 150,
                damping: 20
              } }
              exit={ { x: '-40%', opacity: 0 } }
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          {/* <ChatWidget /> */ }
          <Toaster
            position='bottom-right'
            toastOptions={ {
              success: {
                style: {
                  background: 'green'
                }
              },
              error: {
                style: {
                  background: 'red'
                }
              }
            } }
          />

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Layout>
      </body>
    </html>
  )
}

export function ErrorBoundary () {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className='flex h-full w-full flex-col items-center justify-center text-center'>
            <h1 className='font-bold text-red-500'>Uh Oh!...</h1>
            <h2 className='font-bold text-red-500'>Status:{ error.status }</h2>
            <p>{ error.data.message }</p>
          </div>
          <Scripts />
        </body>
      </html>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex h-full w-full flex-col items-center justify-center text-center'>
          <h1 className='text-2xl font-bold'>uh Oh..</h1>
          <p className='text-xl'>something went wrong</p>
          <pre>{ errorMessage }</pre>
        </div>{ ' ' }
        <Scripts />
      </body>
    </html>
  )
}
