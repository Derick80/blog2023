import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import { z } from 'zod'
import { validateAction } from '~/utilities'
import { createTask } from '~/server/auth/documentation.server'
import { Form, useLoaderData } from '@remix-run/react'

export async function loader({ request, params }: LoaderArgs) {
  return json({ message: 'hello' })
}
const schema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
  section: z.string()
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
  const { title, description, status, section } = formData as ActionInput

  const input = {
    title,
    description,
    status,
    section
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
  return (
    <div className=''>
      <Form method='POST' className='flex flex-col space-y-4'>
        <input
          type='text'
          name='title'
          placeholder='Title'
          className='rounded-md border border-gray-300 p-2'
        />
        <input
          type='text'
          name='description'
          placeholder='Description'
          className='rounded-md border border-gray-300 p-2'
        />
        <input
          type='text'
          name='status'
          placeholder='Status'
          className='rounded-md border border-gray-300 p-2'
        />
        <input
          type='text'
          name='section'
          placeholder='Section'
          className='rounded-md border border-gray-300 p-2'
        />
        <button type='submit' className='rounded-md bg-blue-500 p-2 text-white'>
          Create
        </button>
      </Form>
    </div>
  )
}
