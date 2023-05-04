import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData
} from '@remix-run/react'
import { z } from 'zod'
import { ColBox, RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { isAuthenticated } from '~/server/auth/auth.server'

import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import { validateAction } from '~/utilities'

export async function loader({ request, params }: LoaderArgs) {
  const categories = await prisma.category.findMany({
    orderBy: {
      value: 'asc'
    }
  })
  if (!categories) throw new Error('No categories found')
  return json({ categories })
}

export const schema = z.object({
  categoryName: z.string().min(3).max(50).optional(),
  action: z.enum(['create', 'delete']),
  categoryId: z.string().optional()
})

type ActionInput = z.infer<typeof schema>

export async function action({ request, params }: ActionArgs) {
  // get the session from the request for toast messages
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }

  const { formData, errors } = await validateAction({
    request,
    schema
  })

  if (errors) {
    return json({ errors })
  }

  const { action, categoryId, categoryName } = formData as ActionInput

  if (action === 'create' && categoryName) {
    const category = await prisma.category.create({
      data: {
        value: categoryName,
        label: categoryName
      }
    })
    if (!category) {
      setErrorMessage(session, 'Category not found')
    } else {
      setSuccessMessage(session, 'Category deleted')
    }
  }

  if (action === 'delete' && categoryId) {
    const category = await prisma.category.delete({
      where: {
        id: categoryId
      }
    })
    if (!category) {
      setErrorMessage(session, 'Category not found')
    } else {
      setSuccessMessage(session, 'Category deleted')
    }
  }

  return redirect('/categories', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function CategoriesRoute() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: Record<string, string> }>()

  return (
    <div className='flex flex-col gap-4'>
      <h1>Categories</h1>
      <RowBox className='flex-wrap'>
        {data.categories.map((category) => (
          <div
            key={category.id}
            className='flex gap-2 rounded-md border-2 bg-slate-900 p-1 text-xs text-slate-50 dark:bg-slate-50 dark:text-black'
          >
            <p className='flex-1'>{category.label}</p>
            <Form method='POST'>
              <input type='hidden' name='categoryId' value={category.id} />
              <button type='submit' name='action' value='delete'>
                X
              </button>
            </Form>
          </div>
        ))}
      </RowBox>
      <ColBox>
        <Form className='flex flex-col gap-2' method='POST'>
          <label htmlFor='categoryName'>Add A Category</label>
          <input type='text' name='categoryName' />
          {actionData?.errors?.categoryName && (
            <div>{actionData.errors.categoryName}</div>
          )}
          <Button
            variant='ghost'
            size='base'
            type='submit'
            name='action'
            value='create'
          >
            Add Category
          </Button>
        </Form>
      </ColBox>
      <Outlet />
    </div>
  )
}
