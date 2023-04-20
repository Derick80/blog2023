import { ActionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'

export async function action({ request }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const title = formData.get('title') as string

  if (!title) {
    setErrorMessage(session, 'Invalid input')
    return redirect('/notes/new', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  if (title) {
    setSuccessMessage(session, 'Note created successfully')
    await prisma.note.create({
      data: {
        title,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    })
    return redirect('/notes/new', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  } else {
    setErrorMessage(session, 'Invalid input')
    return redirect('/notes/new', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
}

export default function index() {
  return (
    <div>
      <h1>Notes</h1>
      <Form method='post'>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' id='title' />
        <button type='submit'>Create</button>
      </Form>
    </div>
  )
}
