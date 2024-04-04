// app/routes/auth/$provider.callback.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from './auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
    return authenticator.authenticate('discord', request, {
        successRedirect: '/',
        failureRedirect: '/login'
    })
}
