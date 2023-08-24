import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import type { Project } from '~/resources/projects'
import { projects } from '~/resources/projects'
import SeparatorV2 from '~/components/v3-components/separator_v2'
import ProjectAccordian from '~/components/v3-components/project/project-accordian_v2'
import { getUniqueCategories } from '~/utilities'
import TechnologiesContainer from '~/components/v3-components/project/project-tech-container'

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return null
  }
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
  // this was way too complicated  when it really shouldn't have been
  // When I first finished i realized that these categories are specific to projects and not blog posts. So I had to make a new component for the categories
  const categories = projects.map((project) => project.categories).flat()
  console.log(categories, 'categories from projects')
  console.log(Array.isArray(categories), 'is array')

  const reducedCategories = getUniqueCategories({ categories })
  console.log(reducedCategories, 'reduced categories')

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <div className='flex w-full flex-col gap-2'>
        <h1>Welcome to the Projects Page</h1>

        <SeparatorV2 orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>
            Here are a number of coding Projects that I have completed
          </h6>
        </div>
      </div>
      <TechnologiesContainer categories={reducedCategories} />
      <div className='w-full columns-1 md:columns-2'>
        {projects.map((project) => (
          <ProjectAccordian key={project.id} projects={project} />
        ))}
      </div>
    </div>
  )
}
