import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect
} from '@remix-run/node'
import { authenticator, getSession } from './auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        successRedirect: '/'
    })

    const session = await getSession(request)
    if (!session) return redirect('/login')

    return await getSession(request)
}

export async function action({ request }: ActionFunctionArgs) {
    const url = new URL(request.url)
    const currentPath = url.pathname

    await authenticator.authenticate('totp', request, {
        successRedirect: currentPath,
        failureRedirect: currentPath
    })
}
