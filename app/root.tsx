import type {
  DataFunctionArgs,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction
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
  useOutlet,
  useRouteError
} from '@remix-run/react'
import { ClerkApp } from "@clerk/remix";

import {
  RemixRootDefaultCatchBoundary,
  RemixRootDefaultErrorBoundary,
} from "@remix-run/react/dist/errorBoundaries";
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
import { AnimatePresence, motion } from "framer-motion";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkCatchBoundary } from '@clerk/remix'
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/remix";
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet, preload: 'true' }
]

// SEO  meta tags
export const meta: V2_MetaFunction = () => {
  return [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      property: 'og:title',
      content: "Derick's Remix Blog"
    },
    {
      property: 'og:description',
      content: 'A blog about web development Genetics and other things'
    },
    {
      property: 'og:image',
      content: `https://res.cloudinary.com/dch-photo/image/upload/v1683172202/ixhymfdz3ivktm3j0kul.webp`
    },
    {
      property: 'og:url',
      content: 'https://derickchoskinson.com'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:creator',
      content: '@GeneticsStar'
    },
    {
      name: 'twitter:title',
      content: "Derick's Remix Blog"
    },
    {
      name: 'twitter:description',
      content: 'A blog about web development Genetics and other things'
    },
    {
      name: 'twitter:image',
      content: `https://res.cloudinary.com/dch-photo/image/upload/v1683130418/ibtrqmrqbchxm9pqfta0.jpg`
    },
    {
      name: 'twitter:site',
      content: '@GeneticsStar'
    },
    {
      title: `Derick's Remix Blog`
    }
  ]
}
// long story short I missed the if !toastMessage return so most of the time I was not returning my user because the message is blank.  This way, I think I'm able to use toast and also not have it refresh every time I navigate.
// export const loader = (args: LoaderArgs) => {
//   return rootAuthLoader(args, async ({request}) => {
//     const {sessionId, userId, getToken} = await request.auth;

//   const user = await isAuthenticated(args.request)
//   const categories = await prisma.category.findMany()
//   const session = await getSession(args.request.headers.get('Cookie'))

//   const toastMessage = (await session.get('toastMessage')) as ToastMessage

//   if (!toastMessage) {
//     return json({ toastMessage: null, user, categories,sessionId, userId, getToken })
//   }

//   if (!toastMessage.type) {
//     throw new Error('Message should have a type')
//   }

//   return json(
//     { toastMessage, user, categories, sessionId, userId, getToken },
//     {
//       headers: {
//         'Set-Cookie': await commitSession(session)
//       }
//     },
   

//   ) 

// },
// {
//   loadUser: true,
// }
//   )
// }

export const loader = (args: DataFunctionArgs) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { userId, sessionId, getToken } = request.auth;
      console.log("Root loader auth:", { userId, sessionId, getToken });
      return { message: `Hello from the root loader :)` };
    },
    { loadUser: true }
  );
};
function App() {
  const outlet = useOutlet();

  const { message } = useLoaderData<typeof loader>();
  // const { toastMessage } = data

  // React.useEffect(() => {
  //   if (!toastMessage) {
  //     return
  //   }
  //   const { message, type } = toastMessage

  //   switch (type) {
  //     case 'success':
  //       toast.success(message)
  //       break
  //     case 'error':
  //       toast.error(message)
  //       break
  //     default:
  //       throw new Error(`${type} is not handled`)
  //   }
  // }, [toastMessage])

  return (
    // <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang='en'>
        <head>

          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width,initial-scale=1' />
          <Meta />
          <Links />
        </head>
        <body
            id='body'
        className='bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50'>
        
          
          <Layout>
              
          <AnimatePresence mode='wait' initial={false}>
          <motion.main
            key={useLocation().pathname}
            initial={{ x: "10%", opacity: 0 }}
            animate={{ x: "0", opacity: 1 }}
            transition={{ duration: 0.25,
              type: "spring",
              stiffness: 260,
              damping: 20 
            } }
            exit={{ x: "-40%", opacity: 0 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
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
    // </MantineProvider>
  )
}

  export default ClerkApp(
    App,
  );

  export const CatchBoundary = ClerkCatchBoundary();
export const ErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    const { __clerk_ssr_interstitial_html } = error?.data?.clerkState?.__internal_clerk_state || {};
    if (__clerk_ssr_interstitial_html) {
      return <html dangerouslySetInnerHTML={{ __html: __clerk_ssr_interstitial_html }} />;
    }
    //  Current CatchBoundary Component
    return <RemixRootDefaultCatchBoundary />;
  } else if (error instanceof Error) {
    return <RemixRootDefaultErrorBoundary error={error} />;
  } else {
    let errorString =
      error == null
        ? "Unknown Error"
        : typeof error === "object" && "toString" in error
        ? error.toString()
        : JSON.stringify(error);
    return <RemixRootDefaultErrorBoundary error={new Error(errorString)} />;
  }
};