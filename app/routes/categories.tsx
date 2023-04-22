import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { RowBox } from '~/components/boxes'
import Tags from '~/components/tags'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({ request, params }: LoaderArgs) {
  const categories = await prisma.category.findMany()
  if (!categories) throw new Error('No categories found')
  return json({ categories })
}

export default function CategoriesRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Categories</h1>
      <RowBox className='flex-wrap'>
        {data.categories.map((category) => (
          <div
            key={category.id}
            className='rounded-md border-2 bg-slate-900 p-1 text-xs text-slate-50 dark:bg-slate-50 dark:text-black'
          >
            <Link to={`/categories/${category.id}`}>{category.value}</Link>
          </div>
        ))}
      </RowBox>
      <Outlet />
    </div>
  )
}
