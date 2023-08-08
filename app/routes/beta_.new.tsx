import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import {
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { z } from 'zod'
import { validateAction } from '~/utilities'
import { prisma } from '~/server/prisma.server'
import { Form, useNavigation } from '@remix-run/react'
import React from 'react'

const schema = z.object({
  title: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
  await delay(3000)
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }
  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    return json({ errors })
  }

  const { title } = formData as ActionInput

  const note = await prisma.note.create({
    data: {
      title,
      user: {
        connect: {
          id: user.id
        }
      }
    }
  })

  if (!note) {
    setErrorMessage(session, 'Note not created')
  } else {
    setSuccessMessage(session, 'Note created')
  }

  return json({ note })
}

export default function NewNote() {
  const navigation = useNavigation()
  const formRef = React.useRef<HTMLFormElement>(null)
  const navigate = useNavigation()

  React.useEffect(() => {
    if (navigation.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [navigation.state])

  return (
    <div
      className={
        navigate.state === 'loading' ? 'pointer-events-none opacity-50' : ''
      }
    >
      <h1 className='text-center text-3xl font-bold text-slate-900 dark:text-slate-50'>
        New Note
      </h1>
      <Form ref={formRef} method='post' action='/beta/new'>
        <div className='flex h-fit flex-col justify-around rounded-md border-2 shadow-md drop-shadow-md dark:bg-slate-900  dark:text-slate-50'>
          <div>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              className='w-full text-black'
            />

            <button disabled={navigation.state === 'submitting'} type='submit'>
              {navigation.state === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  )
}
