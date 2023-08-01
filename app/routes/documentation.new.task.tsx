import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  return json({ user })
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))

export default () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <form
            onSubmit={(event) => {
              wait().then(() => setOpen(false))
              event.preventDefault()
            }}
          >
            <label>
              <span>title</span>
              <input type='text' name='title' />
            </label>
            <button type='submit'>Submit</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
