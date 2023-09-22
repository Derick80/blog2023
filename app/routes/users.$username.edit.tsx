import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'

import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import ImageUploader from '~/components/v2-components/blog-ui/image-fetcher'
import type { User } from '~/server/schemas/schemas'
import React from 'react'
import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { z } from 'zod'
import { zx } from 'zodix'
import { validateAction } from '~/utilities'
import Button from '~/components/button'
import { ArrowRightIcon } from '@radix-ui/react-icons'
export async function loader({ request, params }: LoaderArgs) {
  const { username } = params
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true
    }
  })

  if (!currentUser) {
    return json({ error: 'No user found' })
  }

  return json({ currentUser })
}

const schema = z.object({
  imageUrl: z.string().url().min(3).max(1000)
})
type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const { username } = zx.parseParams(params, { username: z.string() })
  if (!username) {
    return json({ error: 'No username provided' })
  }
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }
  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { imageUrl } = formData as ActionInput

  const updatedUser = await prisma.user.update({
    where: {
      username
    },
    data: {
      avatarUrl: imageUrl
    }
  })

  if (!updatedUser) {
    setErrorMessage(session, 'No user found')
    return redirect('/login')
  } else {
    setSuccessMessage(session, 'User updated')
    return redirect(`/users/${updatedUser.username}`, {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
}

export default function UserEdit() {
  const actionData = useActionData<{
    errors?: {
      imageUrl?: string
    }
  }>()
  const data = useLoaderData<{
    currentUser: User
  }>()
  const [url, setUrl] = React.useState('')

  return (
    <div className='flex h-full flex-col items-center gap-2 rounded-md border-2 p-2'>
      <ImageUploader setUrl={setUrl} />
      <div className='flex items-center gap-1 md:gap-2'>
        <div className='h-12 w-12 p-1'>
          <img src={data.currentUser.avatarUrl || ''} alt='avatar' />
        </div>
        {url ? (
          <>
            <ArrowRightIcon />
            <div className='h-12 w-12 p-1'>
              <img src={url} alt='avatar' />
            </div>
          </>
        ) : null}
      </div>
      <Form
        id='updateUser'
        className='flex w-full flex-col items-center justify-center gap-2'
        method='post'
      >
        <input
          type='hidden'
          name='imageUrl'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {actionData?.errors?.imageUrl && <p>{actionData?.errors?.imageUrl}</p>}
      </Form>

      {/* create a button to cancel the change and reload the page */}
      {url ? (
        <>
          {' '}
          <Button
            form='updateUser'
            variant='primary_filled'
            size='base'
            type='submit'
          >
            Update
          </Button>
          <Button
            variant='warning_filled'
            size='base'
            onClick={() => {
              window.location.reload()
            }}
          >
            Cancel
          </Button>
        </>
      ) : null}
    </div>
  )
}
