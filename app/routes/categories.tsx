import { Cross1Icon } from '@radix-ui/react-icons'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Outlet, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { ColBox, RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { isAuthenticated } from '~/server/auth/auth.server'

import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { useOptionalUser, validateAction } from '~/utilities'

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
    setErrorMessage(session, 'You must be logged in to do that')
  }

  const { formData, errors } = await validateAction({
    request,
    schema
  })

  if (errors) {
    return json({ errors })
  }

  const { action, categoryId, categoryName } = formData as ActionInput

  if (action === 'create' && categoryName && user) {
    const category = await prisma.category.create({
      data: {
        value: categoryName,
        label: categoryName
      }
    })
    if (!category) {
      setErrorMessage(session, 'Category not created')
    } else {
      setSuccessMessage(session, 'Category deleted')
    }
  }

  if (action === 'delete' && categoryId && user) {
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
  const user = useOptionalUser()
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: Record<string, string> }>()

  return (
    <div className='flex flex-col items-center gap-4'>
      <h1 className='text-center text-2xl font-bold dark:text-white'>
        Categories
      </h1>
      <p className='text-center text-sm dark:text-white'>
        These are the list of categories used by the blog posts. If you are a
        user you can add and delete categories.
      </p>
      <RowBox className='flex-wrap'>
        {data.categories.map((category) => (
          <>
            <div
              key={category.id}
              className='flex w-fit items-center gap-2 rounded-md border-2 p-1 text-xs dark:bg-slate-50 dark:text-black'
            >
              <p className='flex-1'>{category.label}</p>
              {user && (
                <Button
                  form='deleteCategory'
                  variant='icon_unfilled'
                  size='small'
                  type='submit'
                  name='action'
                  value='delete'
                >
                  <Cross1Icon />
                </Button>
              )}
            </div>
            <Form
              id='deleteCategory'
              className='flex items-center gap-2'
              method='POST'
            >
              <input type='hidden' name='categoryId' value={category.id} />
            </Form>
          </>
        ))}
      </RowBox>
      <ColBox>
        <Form className='flex flex-col items-center gap-2' method='POST'>
          <label htmlFor='categoryName'>Add A Category</label>
          <input
            type='text'
            className='w-fit items-center rounded-md border-2  p-1 text-xs dark:bg-slate-50 dark:text-black'
            name='categoryName'
          />
          {actionData?.errors?.categoryName && (
            <div>{actionData.errors.categoryName}</div>
          )}
          <Button
            variant='success_filled'
            size='base'
            type='submit'
            name='action'
            value='create'
          >
            Save
          </Button>
        </Form>
      </ColBox>
      <Outlet />
    </div>
  )
}
