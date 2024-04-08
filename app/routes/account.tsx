// app/routes/account.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from './_auth+/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: '/'
    })
    return json({ user })
}

export default function Account() {
    let { user } = useLoaderData<typeof loader>()

    return (
        <div className='flex flex-col '>
            <h1>{user && `Welcome ${user.email}`}</h1>
            <Form action='/logout' method='POST'>
                <button>Log out</button>
            </Form>
        </div>
    )
}
