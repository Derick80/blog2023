import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { z } from 'zod'
import CreateProject from '~/components/create-project'
import { getProjects, getTechnologies } from '~/server/project.server'
import { useLoaderData } from '@remix-run/react'

export async function loader ({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return null
  }
  const technologies = await getTechnologies()
  if (!technologies) {
    return null
  }
  const projects = await getProjects()
  if (!projects) {
    return null
  }

  return json({ technologies, projects })
}

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick's Projects`
    }
  ]
}

const ProjectSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('create'),
    title: z.string().min(5, 'Title should be at least 5 characters').max(60),
    description: z.string().min(5, 'Description should be at least 5 characters').max(500),
    primaryImage: z.string().url('Please enter a valid URL').optional(),
    projectUrl: z.string().url('Please enter a valid URL'),
    githubUrl: z.string().url('Please enter a valid URL'),
    status: z.enum(['In Progress', 'Completed', 'Abandoned', 'To Do', 'Backlog']), features: z.array(z.string().min(5, 'Feature should be at least 5 characters').max(60)),
  }),
  z.object({
    intent: z.literal('update'),
    id: z.string(),
    title: z.string().min(5, 'Title should be at least 5 characters').max(60),
    description: z.string().min(5, 'Description should be at least 5 characters').max(500),
    primaryImage: z.string().url('Please enter a valid URL').optional(),
    projectUrl: z.string().url('Please enter a valid URL'),
    githubUrl: z.string().url('Please enter a valid URL'),
    status: z.enum(['In Progress', 'Completed', 'Abandoned', 'To Do', 'Backlog']),
    features: z.array(z.string().min(5, 'Feature should be at least 5 characters').max(60)),
  }),
  z.object({
    intent: z.literal('delete'),
    id: z.string(),
  }),
  z.object({
    intent: z.literal('update-status'),
    projectId: z.string(),
    status: z.enum(['In Progress', 'Completed', 'Abandoned', 'To Do', 'Backlog']),

  }),
  z.object({
    intent: z.literal('new-tech'),
    value: z.string().min(5, 'Technology should be at least 5 characters').max(60),
    url: z.string().url('Please enter a valid URL'),
    projectId: z.string(),
  }),
  z.object({
    intent: z.literal('add-tech-to-project'),
    id: z.string(),
    projectId: z.string(),
  }),
])
export async function action ({ request, params }: ActionFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }



  return json({ user })

}


export default function ProjectIndex () {
  const { technologies, projects } = useLoaderData<typeof loader>()


  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <CreateProject />
    </div>
  )
}
