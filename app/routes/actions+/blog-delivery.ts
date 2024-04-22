import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { prisma } from '~/.server/prisma.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
    console.log('params', params)

    const user = await prisma.user.findUnique({
        where: {
            id: params.userId
        }
    })
    if (!user) {
        return new Response('User not found', { status: 404 })
    }

    return json({ user })
}
export async function action({ request, params }: ActionFunctionArgs) {
    const user = await prisma.user.findUnique({
        where: {
            id: params.id
        }
    })
    if (!user) {
        return new Response('User not found', { status: 404 })
    }
    return user
}
