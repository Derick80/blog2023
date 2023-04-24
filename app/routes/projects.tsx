import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { Card, SimpleGrid } from '@mantine/core'
import { projects } from '~/resources/projects'
import { ColBox, RowBox } from '~/components/boxes'
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
              <ColBox className='p-1'>
                <h3 className='text-base'>Implementations</h3>
                <ul>
                  {project?.implementations?.map((implementation) => (
                    <li
                      className='list-disc text-teal-400'
                      key={implementation.id}
                    >
                      <div className='flex flex-row items-center'>
                        <span className='text-xs leading-5 text-slate-900 dark:text-slate-50'>
                          {implementation.task}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </ColBox>
            </Card.Section>

            <Card.Section>
              <RowBox className='p-1'>
                {project.categories.map((category) => (
                  <div
                    className='flex items-center rounded-md bg-slate-50 p-1 text-black hover:border-2 hover:border-white '
                    key={category.id}
                  >
                    <p className='text-xs'>{category.value}</p>
                  </div>
                ))}
              </RowBox>
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
