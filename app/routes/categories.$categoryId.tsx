import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
import {
  useRouteError,
  isRouteErrorResponse,
  useParams
} from '@remix-run/react'
import type { Category } from '~/server/schemas/schemas'
import { useMatchesData } from '~/utilities'
import {
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
export async function loader ({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You must be logged in to do that')
  }

  const userRole = user.role

  if (userRole !== 'ADMIN') {
    throw new Error('You must be an admin to do that')
  }

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

export async function action ({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('You must be logged in to do that')
  }

  console.log('params', params)

  const { categoryId } = zx.parseParams(params, {
    categoryId: z.string()
  })

  const deleted = await prisma.category.delete({
    where: {
      id: categoryId
    }
  })

  if (!deleted) {
    setErrorMessage(session, 'Category not found')
    return redirect(`/categories/`)
  } else {
    setSuccessMessage(session, 'Category deleted')
    return redirect(`/categories/`)
  }
}

export default function CategoryIndex () {
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
      <h1>{ category.value }</h1>
    </div>
  )
}
export function ErrorBoundary () {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h2>Status:{ error.status }</h2>
        <p>{ error.data.message }</p>
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
      <h1>uh Oh..</h1>
      <p>something went wrong</p>
      <pre>{ errorMessage }</pre>
    </div>
  )
}
