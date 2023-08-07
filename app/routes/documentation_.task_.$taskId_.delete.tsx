import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { deleteTask } from '~/server/task.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return json({ user })
}
export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
  const { taskId } = zx.parseParams(params, { taskId: z.string() })
  console.log(taskId, 'taskId')

  const deleted = await deleteTask(taskId)

  if (!deleted) {
    setErrorMessage(session, 'Task not deleted')
  } else {
    setSuccessMessage(session, `Task ${taskId} deleted`)
    return redirect('/documentation', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
}
