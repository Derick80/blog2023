import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '~/components/ui/card'
import { authenticator } from './auth.server'

export default function LoginRoute() {
    const provider = 'discord'
    return (
        <div className='container max-w-lg md:mt-10'>
            <Card>
                <CardHeader>
                    <CardTitle>Log in by Email or By Discord</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        name='discord'
                        action={`/${provider}`}
                        className='flex flex-col items-center gap-2'
                        method='POST'
                    >
                        <input type='hidden' name='provider' value={provider} />
                        <Button
                            className='w-full text-center justify-center gap-2'
                            type='submit'
                            value='discord'
                            variant='ghost'
                            size='icon'
                        >
                            <DiscordLogoIcon />

                            <p>Log in with Discord </p>
                        </Button>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Link to={`/${provider}`}>Discord</Link>
                    <Link to='/register'>Register</Link>
                    <Link to='/login'> Login </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
    // If the user is already authenticated redirect to /dashboard directly
    return await authenticator.isAuthenticated(request, {
        successRedirect: '/'
    })
}
