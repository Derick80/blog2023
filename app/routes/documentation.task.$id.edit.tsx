import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { Portal } from '~/components/portal'

export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const taskId = zx.parseParams(params, { taskId: z.string() })
  console.log(taskId, 'taskId')
}

export default function EditDocsIndex() {
  return (
    <Portal wrapperId='portal-root'>
      <h1>Task</h1>
    </Portal>
  )
}
