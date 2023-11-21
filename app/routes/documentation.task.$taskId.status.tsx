import type { ActionFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import {
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { validateAction } from '~/utilities'
import { updateTaskStatus } from '~/server/task.server'

const schema = z.object({
  status: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionFunctionArgs) {
  const { taskId } = zx.parseParams(params, { taskId: z.string() })
  console.log(taskId, 'taskId')
  const session = await getSession(request.headers.get('Cookie'))

  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }

  const { formData, errors } = await validateAction({
    request,
    schema
  })

  if (errors) {
    return json({ errors })
  }

  const { status } = formData as ActionInput
  console.log(status, taskId, 'status input')

  const updated = await updateTaskStatus(taskId, status)
  if (updated) {
    setSuccessMessage(session, `Task ${taskId} updated`)
  } else {
    setErrorMessage(session, `Task ${taskId} not updated`)
  }

  return json({ status: updated.status })
}
