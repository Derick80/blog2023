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
  useFetcher,
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
import { getEnv } from './server/env.server'
import { ThemeProvider } from './components/theme/theme-provider'
import { getThemeFromCookie } from './server/theme.server'

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
export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getThemeFromCookie(request)
  // const user = await getUserByEmail('wowbearwow80@gmail.com')
  // console.log(user, 'user');

  const user = await isAuthenticated(request)
  const categories = await prisma.category.findMany({
    orderBy: {
      label: 'asc'
    }
  })
  const session = await getSession(request.headers.get('Cookie'))
  const toastMessage = (await session.get('toastMessage')) as ToastMessage

  if (!toastMessage) {
    return json({ toastMessage: null, user, categories, theme })
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type')
  }

  return json(
    { toastMessage, categories, theme, user, ENV: getEnv() },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  )
}

export default function App() {
  const { theme = 'system' } = useLoaderData<typeof loader>()

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
  const fetcher = useFetcher()
  const onThemeChange = (theme: string) => {
    fetcher.submit(
      { theme },
      {
        method: 'POST',
        encType: 'application/json',
        action: '/actions/set-theme'
      }
    )
  }
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body id='body' className='h-screen bg-background text-foreground'>
        <ThemeProvider defaultTheme={theme} onThemeChange={onThemeChange}>
          <Layout>
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={useLocation().pathname}
                animate={{ x: '90', opacity: 1 }}
                transition={{
                  duration: 0.25,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20
                }}
                exit={{ x: '-40%', opacity: 0 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
            <Toaster
              position='bottom-right'
              toastOptions={{
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
              }}
            />

            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}

const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>Oops! Error</h1>
        <p className='text-lg text-red-700'>{`Status: ${error.status}`}</p>
        <p className='text-lg text-red-700'>{error.data.message}</p>
      </div>
    )
  }

  let errorMessage = 'Unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold text-red-600 mb-4'>Uh oh...</h1>
      <h2 className='text-xl font-semibold text-red-700 mb-4'>
        Something went wrong
      </h2>
      <pre className='text-lg text-red-700 whitespace-pre-wrap'>
        {errorMessage}
      </pre>
    </div>
  )
}
