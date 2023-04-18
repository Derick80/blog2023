import { LoaderArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
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


export default function CategoriesRoute() {
    const data = useLoaderData<typeof loader>()


    return (
        <div>
            <h1>Categories</h1>
            {data.categories.map(category => (
                <div key={category.id}>
                    <h2>{category.value}</h2>
                </div>
            ))}
            <Outlet />
        </div>



    )
}
