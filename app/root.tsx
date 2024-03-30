import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useLoaderData,
} from '@remix-run/react'
import { json } from "@remix-run/node"; // or cloudflare/deno

import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import stylesheet from '~/tailwind.css?url'
import { environment } from './.server/env.server'
import { getThemeFromCookie } from './.server/theme.server.ts'
import { ThemeProvider } from './components/theme/theme-provider'

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet }
]

export async function loader ({request}:LoaderFunctionArgs) {
    const theme = await getThemeFromCookie(request) as string

    const mode = environment().NODE_ENV
    console.log(`The current mode is: ${mode}`);

    return json({ theme})

}

export function Layout ({ children }: { children: React.ReactNode }) {
    const { theme ='system' } = useLoaderData<typeof loader>()
    const themeFetcher = useFetcher()
    const onThemeChange = (theme:string) => {
        themeFetcher.submit(
            { theme },
            {
                method: 'POST',
                encType: 'application/json',
                action: '/actions/set-theme'
            }
        )
    }
    const data = useLoaderData<typeof loader>()
    console.log(data, 'data')
    return (
        <ThemeProvider defaultTheme={ theme } onThemeChange={ onThemeChange }>

        <html lang='en'>
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
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
            </html>
        </ThemeProvider>
    )
}

export default function App() {
    return <Outlet />
}
