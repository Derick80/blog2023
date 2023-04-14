import { LoaderArgs, json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
    const user = await isAuthenticated(request)
    invariant(user, 'User is not authenticated')
    const userId = user.id
    const categories = await prisma.category.findMany()



    return json({ categories })
}
