import { isAuthenticated } from '~/server/auth/auth.server'
import type { ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import Button from '~/components/button'
export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const options = formData.get('options')

  const user = await isAuthenticated(request)

  const opts = options?.toString().split(',')

  const option = opts?.map((opt) => {
    return {
      value: opt
    }
  })

  const poll = await prisma.poll.create({
    data: {
      title: title as string,
      description: description as string,
      options: {
        create: option
      }
    }
  })

  if (!poll) {
    setErrorMessage(session, 'Poll creation failed')
    return json({ error: 'Poll creation failed' })
  } else {
    setSuccessMessage(session, 'Poll created successfully')
  }
  return redirect('/polls', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function PollCreationIndex() {
  return (
    <div className='h-full w-full border-2'>
      <Form
        method='POST'
        className='flex w-full flex-col rounded-md border-2 text-black'
      >
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' placeholder='Title' />
        <label htmlFor='description'>Description</label>
        <input type='text' name='description' placeholder='Description' />
        <label htmlFor='options'>Options</label>
        <input type='text' name='options' placeholder='Options' />

        <Button variant='primary_filled' size='base' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  )
}
