import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { authenticator, ProviderNameSchema } from './auth.server'

export const loader = () => redirect('/login')

// app/routes/auth.discord.tsx

export async function action({ request, params }: ActionFunctionArgs) {
    const providerName = ProviderNameSchema.parse(params.provider)

    return authenticator.authenticate(providerName, request, {
        successRedirect: '/',
        failureRedirect: '/login'
    })
}
