import { Cross1Icon } from '@radix-ui/react-icons'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/react'
import {
  Form,
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation
} from '@remix-run/react'
import clsx from 'clsx'
import React from 'react'
import { z } from 'zod'
import Button from '~/components/button'
import SeparatorV2 from '~/components/v2-components/separator_v2'
import { isAuthenticated } from '~/server/auth/auth.server'

import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage
} from '~/server/session.server'
import {
  capitalizeFirstLetter,
  useOptionalUser,
  validateAction
} from '~/utilities'
// deleting a category doesn't work correctly it deletes the wrong category
export async function loader ({ request, params }: LoaderFunctionArgs) {
  const categories = await prisma.category.findMany({
    orderBy: {
      value: 'asc'
    }
  })
  if (!categories) throw new Error('No categories found')
  return json({ categories })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: 'Categories' },
    {
      name: 'Categories',

      content: data?.categories?.map((category) => category.label).join(', ')
    }
  ]
}

export const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('create'),
    categoryName: z.string().min(1, 'Category name is required')
  }),
  z.object({
    intent: z.literal('delete'),
    categoryId: z.string().min(1, 'Category name is required')
  }),
  z.object({
    intent: z.literal('update'),
    categoryId: z.string().min(1, 'Category name is required'),
    categoryName: z.string().min(1, 'Category name is required')
  })
])
type ActionInput = z.infer<typeof schema>

export async function action ({ request, params }: ActionFunctionArgs) {
  // get the session from the request for toast messages
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'You must be logged in to do that')
  }

  const formData = await request.formData()

  // Parse the form data
  const payload = Object.fromEntries(formData)
  const result = schema.safeParse(payload)

  if (!result.success) {
    return json({
      error: result.error.flatten().fieldErrors,
      success: false,
    })
  }


  switch (result.data.intent) {
    case 'create': {
      const categoryExists = await prisma.category.findUnique({
        where: {
          value: capitalizeFirstLetter(result.data.categoryName)
        }
      })
      if (categoryExists) {
        setErrorMessage(session, 'Category already exists')
        return redirect('/categories', {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        })
      } else {
        const category = await prisma.category.create({
          data: {
            value: capitalizeFirstLetter(result.data.categoryName),
            label: capitalizeFirstLetter(result.data.categoryName)
          }
        })

        if (!category) {
          return json({ errors: { categoryName: 'Category not created' } })
        } else {
          return json({ category })
        }
      }
    }
    case 'delete': {
      const category = await prisma.category.delete({
        where: {
          id: result.data.categoryId
        }
      })
      if (!category) {
        return json({ errors: { categoryName: 'Category not deleted' } })
      } else {
        return json({ category })
      }
    }
    case 'update': {
      const category = await prisma.category.update({
        where: {
          id: result.data.categoryId
        },
        data: {
          value: capitalizeFirstLetter(result.data.categoryName),
          label: capitalizeFirstLetter(result.data.categoryName)
        }
      })
      if (!category) {
        return json({ errors: { categoryName: 'Category not updated' } })
      } else {
        return json({ category })
      }
    }
  }
}
export default function CategoriesRoute () {
  const user = useOptionalUser()
  const isAdmin = user?.role === 'ADMIN' ? true : false

  console.log(isAdmin);

  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: Record<string, string> }>()
  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)


  React.useEffect(() => {
    if (navigation.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [navigation.state])
  return (
    <div className='items- flex w-full flex-col gap-2'>
      <div className='flex flex-col items-start gap-20 '>
        <h1>Categories</h1>
        <h4>These are the list of categories used by the blog posts.</h4>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <SeparatorV2 orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>If you are an Admin you may delete </h6>
          <h1>Categories</h1>
        </div>
        <div className='bg-violet flex w-full flex-row flex-wrap items-center gap-2'>
          { data.categories.map((category) => (

            <Form
              key={ category.id }
              id='deleteCategory'
              className={ clsx(
                'focus-ring dark:bg-violet3j_dark dark:hover:bg-violet4j_dark relative mb-4 mr-4 flex h-auto w-auto  cursor-auto rounded-full bg-violet3  px-6 py-3 text-violet12 opacity-100 transition dark:bg-violet3_dark dark:text-slate-50'
              ) }
              method='POST'
            >
              <p className='flex-1'>{ category.label }</p>

              <input type='hidden' name='categoryId' value={ category.id } />
              {
                isAdmin && (<Button
                  variant='icon_unfilled'
                  size='small'
                  type='submit'
                  name='intent'
                  value='delete'
                >
                  <Cross1Icon />
                </Button>)
              }
            </Form>

          )) }
        </div>
      </div>

      {
        isAdmin && (
          <Form
            id='createCategory'
            ref={ formRef }
            className='flex flex-col items-center gap-2'
            method='POST'
          >
            <label htmlFor='categoryName'>Add A Category</label>
            <input
              type='text'
              className='rounded-md border text-sm text-black'
              name='categoryName'
            />
            { actionData?.errors?.categoryName && (
              <div>{ actionData.errors.categoryName }</div>
            ) }
            <Button
              form='createCategory'
              variant='success_filled'
              size='base'
              type='submit'
              name='intent'
              value='create'
            >
              Save
            </Button>
          </Form>
        )
      }
      <Outlet />
    </div>
  )
}
