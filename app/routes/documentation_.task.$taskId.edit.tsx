import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import type { Task } from '~/server/task.server'
import { getTask, getTaskCategories, updateTask } from '~/server/task.server'
import { Form, useActionData } from '@remix-run/react'
import Button from '~/components/button'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { validateAction } from '~/utilities'
import CustomSelectBox from '~/components/v3-components/custom-select'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const { taskId } = zx.parseParams(params, { taskId: z.string() })
  console.log(taskId, 'taskId')

  if (!taskId) throw new Error('No task id found' + taskId)

  const task = await getTask(taskId)
  if (!task) throw new Error('No task found')

  const categories = await getTaskCategories()
  if (!categories) {
    return json({ categories: [] })
  }

  const categoryArray = categories.map((category) => category.value)
  console.log(categoryArray, 'categoryArray')

  return typedjson({ task, categories: categoryArray })
}

const statusOptions = [`📆 To Do`, `⏩ In Progress`, `✅ Completed`, `💡 Idea`]

const StatusEnum = z.enum([
  `📆 To Do`,

  `⏩ In Progress`,

  `✅ Completed`,

  `💡 Idea`
])

const schema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(5, 'Title should be at least 5 characters')
    .max(100, 'Title should be less than 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description should be at least 10 characters'),
  status: StatusEnum,
  section: z.string({ required_error: 'Section is required' }),
  taskCategory: z.string().array()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const session = await getSession(request.headers.get('Cookie'))

  const { taskId } = zx.parseParams(params, { taskId: z.string() })
  console.log(taskId, 'taskId')

  const { formData, errors } = await validateAction({ request, schema })
  if (errors) {
    return json({ errors }, { status: 400 })
  }

  const { title, description, status, section, taskCategory } =
    formData as ActionInput
  const categoryToUpdate = taskCategory.map((category) => {
    return {
      value: category
    }
  })
  const input = {
    id: taskId,
    title,
    description,
    status,
    section,
    categories: categoryToUpdate
  }

  const updated = await updateTask(taskId, input)

  if (!updated) {
    setSuccessMessage(session, 'Task not updated')
  } else {
    setErrorMessage(session, 'Task updated')
  }

  return redirect('/documentation', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })

  //
}

export default function EditDocsIndex() {
  // const data = useLoaderData<{ task: Task; categories: string[] }>()
  const data = useTypedLoaderData<{ task: Task; categories: string[] }>()
  const ActionData = useActionData<{ errors: ActionInput }>()
  console.log(data.task, 'data.task')

  const pickedCategories = data.task.categories.map(
    (category) => category.value
  )

  return (
    <div className='flex flex-col items-center gap-1 md:gap-2 lg:gap-3'>
      <h1>Edit Task</h1>
      <Form method='post' className='flex flex-col gap-1 md:gap-2 lg:gap-3'>
        <label className='text-slate-900' htmlFor='title'>
          Title
        </label>
        <input
          className='text-black'
          type='text'
          name='title'
          id='title'
          defaultValue={data.task.title}
        />
        {ActionData?.errors?.title && (
          <span className='text-red-500'>{ActionData.errors.title}</span>
        )}
        <label className='text-slate-900' htmlFor='description'>
          Description
        </label>
        <input
          className='text-black'
          type='text'
          name='description'
          id='description'
          defaultValue={data.task.description}
        />
        {ActionData?.errors?.description && (
          <span className='text-red-500'>{ActionData.errors.description}</span>
        )}
        <label className='text-slate-900' htmlFor='status'>
          Status
        </label>
        <CustomSelectBox
          name='status'
          options={statusOptions}
          picked={[data.task.status]}
        />
        {ActionData?.errors?.status && (
          <span className='text-red-500'>{ActionData.errors.status}</span>
        )}
        <label className='text-slate-900' htmlFor='section'>
          Section
        </label>
        <input
          className='text-black'
          type='text'
          name='section'
          id='section'
          defaultValue={data.task.section}
        />
        {ActionData?.errors?.section && (
          <span className='text-red-500'>{ActionData.errors.section}</span>
        )}
        <label className='text-slate-900' htmlFor='taskCategory'>
          Task Category
        </label>
        <CustomSelectBox
          name='taskCategory'
          picked={pickedCategories}
          options={data.categories}
          creatable={true}
          actionPath='/documentation/task/taskCategory/new/'
        />

        {ActionData?.errors?.taskCategory && (
          <span className='text-red-500'>{ActionData.errors.taskCategory}</span>
        )}

        <Button variant='primary' type='submit'>
          <FilePlusIcon />
        </Button>
      </Form>
    </div>
  )
}
