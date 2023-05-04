import type { LinksFunction, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
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
  useRouteError
} from '@remix-run/react'
import { isAuthenticated } from './server/auth/auth.server'
import Layout from './components/layout'
import stylesheet from '~/tailwind.css'
import type { ToastMessage } from './server/auth/session.server'
import { commitSession, getSession } from './server/auth/session.server'
import React from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { prisma } from './server/auth/prisma.server'
import { StylesPlaceholder } from '@mantine/remix'
import { MantineProvider } from '@mantine/core'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet, preload: 'true' }
]

// SEO  meta tags
export const meta: V2_MetaFunction = () => {
  return [
    {
      name:'viewport',
      content:'width=device-width, initial-scale=1'
    },
    {
      property:'og:title',
      content:'Derick\'s Remix Blog'
    },
    {
      property:'og:description',
      content:'A blog about web development Genetics and other things'
    },
    {
      property:'og:image',
        content:`https://res.cloudinary.com/dch-photo/image/upload/v1683172202/ixhymfdz3ivktm3j0kul.webp`
    },
    {
      property:'og:url',
      content:'https://derickchoskinson.com'
    },
    {
      property:'og:type',
      content:'website'
    },
    {
      name:'twitter:card',
      content:'summary_large_image'
    },
    {
      name:'twitter:creator',
      content:'@GeneticsStar'
    },
    {
      name:'twitter:title',
      content:'Derick\'s Remix Blog'
    },
    {
      name:'twitter:description',
      content:'A blog about web development Genetics and other things'
    },
    {
      name:'twitter:image',
      content:`https://res.cloudinary.com/dch-photo/image/upload/v1683130418/ibtrqmrqbchxm9pqfta0.jpg`
    },
    {
      name:'twitter:site',
      content:'@GeneticsStar'
    },
    {
      title:`Derick's Remix Blog`,
    }
  ]
}
// long story short I missed the if !toastMessage return so most of the time I was not returning my user because the message is blank.  This way, I think I'm able to use toast and also not have it refresh every time I navigate.
export async function loader({ request }: LoaderArgs) {
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
    { toastMessage, user, categories },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  )
}
export default function App() {
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang='en'>
        <head>
          <StylesPlaceholder />

          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          <Meta />
          <Links />
        </head>
        <body className='bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50'>
          <Layout>
            <Outlet />
            {/* <ChatWidget /> */}
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
        </body>
      </html>
    </MantineProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div
        className='flex flex-col items-center justify-center w-full h-full text-center'
      >
        <h1
          className='text-2xl font-bold text-red-500'
        >Uh Oh!...</h1>
        <h1
          className='text-2xl font-bold text-red-500'
        >Status:{error.status}</h1>
        <p
          className='text-xl'
        >{error.data.message}</p>
      </div>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <div
      className='flex flex-col items-center justify-center w-full h-full text-center'
    >
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
