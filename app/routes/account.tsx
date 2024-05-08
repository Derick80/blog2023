// app/routes/account.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator, getUserId, isAuthenticated } from './_auth+/auth.server'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '~/components/ui/card'
import EditableTextField from '~/components/editable-text'
import { Label } from '~/components/ui/label'
import { H3, Muted, P } from '~/components/ui/typography'
import { Button } from '~/components/ui/button'

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await isAuthenticated(request)
    if (!user) return redirect('/login')

    return json({ user })
}

export default function Account() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <div className='flex flex-col '>
            <h1>{user && `Welcome ${user.email}`}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <H3>Email</H3>
                    <Muted>{user.email}</Muted>
                    <H3>Username</H3>
                    <EditableTextField initialValue={user.username} />
                    <div className='flex flex-col gap-1 md:gap-2'>
                        <H3>Role</H3>
                        <Muted>{user.role}</Muted>
                        request a role change TBD
                    </div>
                </CardContent>
                <CardFooter>
                    <Form action='/logout' method='POST'>
                        <Button
                            name='logout'
                            type='submit'
                            variant='destructive'
                            className='w-full'
                        >
                            Log out
                        </Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    )
}
