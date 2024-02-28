import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { getProjects } from '~/server/project.server'
import { Link, useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/prisma.server'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  ArchiveX,
  ArrowUpRightSquare,
  Car,
  CircleDashed,
  ListTodo,
  PauseCircle,
  XCircleIcon
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { P, Small } from '~/components/ui/typography'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Badge } from '~/components/ui/badge'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const projects = await getProjects()

  if (!projects) {
    throw new Error("Couldn't find any projects.")
  }

  console.log(projects, 'projects')

  return json({ projects })
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
    description: z
      .string()
      .min(5, 'Description should be at least 5 characters')
      .max(500),
    primaryImage: z.string().url('Please enter a valid URL').optional(),
    projectUrl: z.string().url('Please enter a valid URL'),
    githubUrl: z.string().url('Please enter a valid URL'),
    status: z.enum([
      'In Progress',
      'Completed',
      'Abandoned',
      'To Do',
      'Backlog'
    ]),
    features: z.array(
      z.string().min(5, 'Feature should be at least 5 characters').max(60)
    )
  }),
  z.object({
    intent: z.literal('update'),
    id: z.string(),
    title: z.string().min(5, 'Title should be at least 5 characters').max(60),
    description: z
      .string()
      .min(5, 'Description should be at least 5 characters')
      .max(500),
    primaryImage: z.string().url('Please enter a valid URL').optional(),
    projectUrl: z.string().url('Please enter a valid URL'),
    githubUrl: z.string().url('Please enter a valid URL'),
    status: z.enum([
      'In Progress',
      'Completed',
      'Abandoned',
      'To Do',
      'Backlog'
    ]),
    features: z.array(
      z.string().min(5, 'Feature should be at least 5 characters').max(60)
    )
  }),
  z.object({
    intent: z.literal('delete'),
    id: z.string()
  }),
  z.object({
    intent: z.literal('update-status'),
    projectId: z.string(),
    status: z.enum([
      'In Progress',
      'Completed',
      'Abandoned',
      'To Do',
      'Backlog'
    ])
  }),
  z.object({
    intent: z.literal('new-tech'),
    value: z
      .string()
      .min(5, 'Technology should be at least 5 characters')
      .max(60),
    url: z.string().url('Please enter a valid URL'),
    projectId: z.string()
  }),
  z.object({
    intent: z.literal('add-tech-to-project'),
    id: z.string(),
    projectId: z.string()
  })
])
export async function action({ request, params }: ActionFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'Unauthorized' }, { status: 401 })
  }

  return json({ user })
}

export default function ProjectIndex() {
  const { projects } = useLoaderData<typeof loader>()
  const allTechStacks = projects
    .map((project) => project.technologyStacks)
    .flat()
  console.log(allTechStacks, 'allTechStacks')

  const uniqueCategories = Array.from(
    new Set(allTechStacks.map((category) => category.value))
  ).map((value) => {
    const category = allTechStacks.find((category) => category.value === value)
    return {
      value,
      url: category?.url || ''
    }
  })

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      {projects.map((project) => (
        <Card key={project.id} className='w-full md:w-3/4 lg:w-1/2 xl:w-1/3'>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>{' '}
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <P>Features</P>
            <ul>
              {project.features.map((feature) => (
                <li key={feature.id}>{feature.value}</li>
              ))}
            </ul>
            <div className='flex flex-row gap-2 w-full flex-wrap'>
              {project.technologyStacks.map((tech) => (
                <Badge key={tech.id}>
                  <Link
                    prefetch='intent'
                    to={tech.url}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {tech.value}
                  </Link>
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className='flex flex-row justify-between items-center gap-2'>
            <Button
              variant='ghost'
              size='default'
              className='flex flex-row items-center gap-1'
              asChild
            >
              {project.githubUrl && (
                <Link
                  prefetch='intent'
                  to={project.githubUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='flex flex-row items-center gap-1'
                >
                  <Small>GitHub</Small>
                  <GitHubLogoIcon />
                </Link>
              )}
            </Button>
            <Button
              variant='ghost'
              size='default'
              className='flex flex-row items-center gap-1'
              asChild
            >
              {project.projectUrl && (
                <Link
                  prefetch='intent'
                  to={project.projectUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='flex flex-row items-center gap-1'
                >
                  <Small className='sm:hidden md:block'>Live</Small>
                  <ArrowUpRightSquare />
                </Link>
              )}
            </Button>
            {project.status && assignStatusIcon(project.status)}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function assignStatusIcon(status: string) {
  if (status === 'In Progress') {
    return (
      <Button
        variant='ghost'
        size='default'
        className='flex flex-row items-center gap-1'
      >
        <CircleDashed />
        <Small>In Progress</Small>
      </Button>
    )
  } else if (status === 'Completed') {
    return '✅'
  } else if (status === 'Abandoned') {
    return (
      <Button
        variant='ghost'
        size='default'
        className='flex flex-row items-center gap-1'
      >
        <XCircleIcon />
        <Small>Abandoned</Small>
      </Button>
    )
  } else if (status === 'Archived') {
    return (
      <Button
        variant='ghost'
        size='default'
        className='flex flex-row items-center gap-1'
      >
        <ArchiveX />
        <Small>Archived</Small>
      </Button>
    )
  } else if (status === 'To Do') {
    return (
      <Button
        variant='ghost'
        size='default'
        className='flex flex-row items-center gap-1'
      >
        <ListTodo />
        <Small>To Do</Small>
      </Button>
    )
  } else {
    return <PauseCircle />
  }
}
