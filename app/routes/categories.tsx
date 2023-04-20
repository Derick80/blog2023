import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Tags from '~/components/tags'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) return json({ categories: [] }, { status: 401 })
  const categories = await prisma.category.findMany()

  return json({ categories })
}

export default function CategoriesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Categories</h1>
      {data.categories.map((category) => (
        <Tags key={category.id} categories={[category]} />
      ))}
      <Outlet />
    </div>
  )
}
