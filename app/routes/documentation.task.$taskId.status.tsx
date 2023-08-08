import type { ActionArgs } from '@remix-run/node'
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
  status: z.string(),
  id: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  // const { taskId } = zx.parseParams(params, { taskId: z.string() })
  // console.log(taskId, 'taskId')
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

  const { status, id } = formData as ActionInput
  console.log(status, id, 'status input')

  const updated = await updateTaskStatus(id, status)
  if (updated) {
    setSuccessMessage(session, `Task ${id} updated`)
  } else {
    setErrorMessage(session, `Task ${id} not updated`)
  }

  return json({ updated })
}
