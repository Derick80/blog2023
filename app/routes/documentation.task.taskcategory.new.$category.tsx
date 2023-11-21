import type { ActionFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { addTaskCategory } from '~/server/task.server'
export async function action({ request, params }: ActionFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }

  const category = params.category
  console.log(category, 'category')

  if (!category) {
    return json({ error: 'Task category is required' })
  }

  const added = await addTaskCategory(category)

  if (!added) {
    return json({ error: 'Task category could not be added' })
  }

  return json({ message: 'Task category added' })
}
