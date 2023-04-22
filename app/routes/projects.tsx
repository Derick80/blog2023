import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { Card, SimpleGrid } from '@mantine/core'
import { projects } from '~/resources/projects'
import { RowBox } from '~/components/boxes'
import { Link } from '@remix-run/react'
import { GitHubLogoIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)

  return json({ user })
}

export default function ProjectIndex() {
  return (
    <div>
      <h1>Projects</h1>
      <SimpleGrid cols={2}>
        {projects.map((project) => (
          <Card
            shadow='md'
            withBorder
            className='dark:bg-slate-900 dark:text-slate-50'
            key={project.id}
          >
            <Card.Section>
              <h4 className='dark:text-slate-50'>{project.title}</h4>

              <img
                src={project.projectImage}
                alt={project.title}
                className='w-full'
              />
            </Card.Section>
            <Card.Section>
              <p className='text-sm'>{project.description}</p>
            </Card.Section>
            <Card.Section>
              <RowBox className='p-1'>
                <Link to={project.githubUrl}>
                  <GitHubLogoIcon />
                </Link>
                <div className='flex-1' />
                <Link to={project.projectUrl}>
                  <OpenInNewWindowIcon />
                </Link>
              </RowBox>
            </Card.Section>
          </Card>
        ))}
      </SimpleGrid>

      <p>Projects</p>
    </div>
  )
}
