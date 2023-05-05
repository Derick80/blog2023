import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { projects } from '~/resources/projects'
import { ColBox, RowBox } from '~/components/boxes'
import { Link } from '@remix-run/react'
import { GitHubLogoIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)

  return json({ user })
}

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: `Derick's Projects`
    }
  ]
}

export default function ProjectIndex() {
  return (
    <div>
      <h1 className='text-center text-3xl font-bold text-slate-900 dark:text-slate-50'>
        Projects
      </h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {projects.map((project) => (
          <div
            className='flex h-fit flex-col justify-around rounded-md border-2 shadow-md drop-shadow-md dark:bg-slate-900  dark:text-slate-50'
            key={project.id}
          >
            <div>
              <h4 className='p-1 dark:text-slate-50'>{project.title}</h4>

              <img
                src={project.projectImage}
                alt={project.title}
                className='w-full'
              />
            </div>
            <div>
              <p className='text-sm'>{project.description}</p>
            </div>
            <ColBox className='p-1 '>
              <h3 className='text-base'>Implementations</h3>
              <ul className='flex flex-col items-start px-4'>
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

            <h3 className='text-base'>Technologies</h3>
            <RowBox className='flex flex-wrap p-1 '>
              {project.categories.map((category) => (
                <div
                  className='flex items-center  rounded-md border-2 bg-slate-50 p-1 text-black hover:border-2 hover:border-white '
                  key={category.id}
                >
                  <span className='text-xs leading-5 text-slate-900'>
                    {category.value}
                  </span>
                </div>
              ))}
            </RowBox>

            <RowBox className='p-1 '>
              <Link to={project.githubUrl}>
                <GitHubLogoIcon />
              </Link>
              <div className='flex-1' />
              <Link to={project.projectUrl}>
                <OpenInNewWindowIcon />
              </Link>
            </RowBox>
          </div>
        ))}
      </div>
    </div>
  )
}
