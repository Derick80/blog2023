import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zfd } from 'zod-form-data'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/auth/prisma.server'
import {
  useRouteError,
  isRouteErrorResponse,
  useMatches,
  useParams
} from '@remix-run/react'
import { Category } from '~/server/schemas/schemas'
import { useMatchesData } from '~/utilities'
export async function loader({ request, params }: LoaderArgs) {
  // I don't have to return the categories data because I can useMatchesdata to get it from already existing spot in root on the client
  const categoryId = zx.parseParams(params, {
    categoryId: z.string()
  }).categoryId
  const categories = await prisma.category.findMany({
    where: {
      id: categoryId
    },
    include: {
      posts: true
    }
  })
  if (!categories) throw new Error('No categories found')

  return json({})
}

export default function CategoryIndex() {
  const parentData = useMatchesData('root') as {
    categories: Category[]
  }
  const params = useParams()
  const category = parentData.categories.find(
    (category: Category) => category.id === params.categoryId
  ) as Category
  if (!category) throw new Error('Category not found')

  return (
    <div className=''>
      <h1 className='text-4xl font-semibold'>{category.value}</h1>
    </div>
  )
}
export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h1>Status:{error.status}</h1>
        <p>{error.data.message}</p>
      </div>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <div>
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
