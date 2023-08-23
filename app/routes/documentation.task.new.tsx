import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { z } from 'zod'
import { validateAction } from '~/utilities'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import Button from '~/components/button'
import { createTask, getTaskCategories } from '~/server/task.server'
import CustomSelectBox from '~/components/v3-components/custom-select'

export async function loader({ request, params }: LoaderArgs) {
  const categories = await getTaskCategories()
  if (!categories) {
    return json({ categories: [] })
  }
  return json({ categories })
}

const StatusEnum = z.enum(['To Do', 'In Progress', 'Completed', 'Idea'])

const schema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title should be at least 5 characters')
    .max(100, 'Title should be less than 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description should be at least 10 characters'),
  status: StatusEnum,
  section: z.string({ required_error: 'Section is required' }),
  taskCategory: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  const isAdmin = user?.role === 'ADMIN'
  if (!isAdmin) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  const { formData, errors } = await validateAction({ request, schema })
  if (errors) {
    return json({ errors }, { status: 400 })
  }
  const { title, description, status, section, taskCategory } =
    formData as ActionInput

  const input = {
    title,
    description,
    status,
    section,
    taskCategory
  }

  const completed = await createTask(input)
  if (!completed) {
    setErrorMessage(session, 'Task not created')
  } else {
    setSuccessMessage(session, 'Task created')
  }
  return redirect('/documentation', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function CreateNewDocumentationRoute() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: ActionInput }>()

  const reducedCategories = data.categories.map((category) => {
    return category.value
  })

  return (
    <div className='w-full'>
      <h1>Create New Task</h1>
      <Form method='POST' className='flex flex-col space-y-4'>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          name='title'
          placeholder='Title'
          className='rounded-md border border-gray-300 p-2'
        />
        {actionData?.errors?.title && (
          <p className='text-red-500'>{actionData.errors.title}</p>
        )}
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          name='description'
          placeholder='Description'
          className='rounded-md border border-gray-300 p-2'
        />
        {actionData?.errors?.description && (
          <p className='text-red-500'>{actionData.errors.description}</p>
        )}

        <label htmlFor='status'>Status</label>
        <CustomSelectBox
          options={['To Do', 'In Progress', 'Completed', 'Idea']}
          picked={[]}
          name='status'
        />

        {actionData?.errors?.status && (
          <p className='text-red-500'>{actionData.errors.status}</p>
        )}
        <label htmlFor='section'>Section</label>
        <input
          type='text'
          name='section'
          placeholder='Section'
          className='rounded-md border border-gray-300 p-2'
        />
        {actionData?.errors?.section && (
          <p className='text-red-500'>{actionData.errors.section}</p>
        )}
        <label htmlFor='taskCategory'>Task Category</label>

        <CustomSelectBox
          options={reducedCategories}
          picked={[]}
          name='taskCategory'
          creatable={true}
          actionPath='/documentation/task/taskCategory/new/'
        />
        <Button type='submit' size='base' color='primary'>
          Submit
        </Button>
      </Form>
    </div>
  )
}
