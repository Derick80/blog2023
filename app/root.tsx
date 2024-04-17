import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteLoaderData
} from '@remix-run/react'
import { json } from '@remix-run/node' // or cloudflare/deno

import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import stylesheet from '~/tailwind.css?url'
import { getThemeFromCookie } from './.server/theme.server.ts'
import { getSharedEnvs } from './.server/env.server.js'
import { getSession } from './routes/_auth+/auth.server.js'
import { TooltipProvider } from './components/ui/tooltip.js'
import { useNonce } from './lib/nonce-provider.js'
import NavigationBar from './components/navbar/navigation-bar.js'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet }
]

export async function loader({ request }: LoaderFunctionArgs) {
    const theme = await getThemeFromCookie(request)
    const { NODE_ENV } = getSharedEnvs()
    console.log(theme,'theme in root');

    const mode = NODE_ENV
    // const theme:Theme = 'system'

    const session = await getSession(request)

    return json({ theme:'system' })
}

// place TooltipProvider here to wrap the entire app in it

export function Layout({ children }: { children: React.ReactNode }) {
    const { theme } = useLoaderData<typeof loader>()

    const nonce = useNonce()
    return (
        <TooltipProvider>
            <html lang='en' className={`${theme}`}>
                <head>
                    <meta charSet='utf-8' />
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1'
                    />
                    <Meta />
                    <Links />
                </head>
                <body>
                    <NavigationBar
                    />
                    {children}
                    <ScrollRestoration />
                    <Scripts nonce={nonce} />
                </body>
            </html>
        </TooltipProvider>
    )
}

export default function App() {
    return <Outlet />
}

export function useRootLoaderData() {
    return useRouteLoaderData<typeof loader>('root')
}

export function ErrorBoundary() {
    // the nonce doesn't rely on the loader so we can access that
    const nonce = useNonce()

    // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
    // likely failed to run so we have to do the best we can.
    // We could probably do better than this (it's possible the loader did run).
    // This would require a change in Remix.

    // Just make sure your root route never errors out and you'll always be able
    // to give the user a better UX.

    return (
        <div className='text-red-500'>
            <h1>Something went wrong</h1>
            <p>Sorry about that. Please try again.</p>
            <Scripts nonce={nonce} />
        </div>
    )
}
