import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { Implementation, Project, projects } from '~/resources/projects'
import { ColBox, RowBox } from '~/components/boxes'
import { Link } from '@remix-run/react'
import { GitHubLogoIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { Category_v2 } from '~/server/schemas/schemas_v2'
import ProjectAccordian from '~/components/accordian_v2'
import CategoryContainer from '~/components/v3-components/blog-ui/category_v2'

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
  // this was way too complicated  when it really shouldn't have been
  // When I first finished i realized that these categories are specific to projects and not blog posts. So I had to make a new component for the categories

  const getUniqueCategories = (projects: Project[]) => {
    const categories = projects
      .map((project: Project) => project.categories)
      .flat()
    const uniqueCategories = [...new Set(categories.map((c) => c.value))]

    return uniqueCategories
  }

  const reducedCategories = getUniqueCategories(projects)

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <h1>Projects</h1>
      <TechnologiesContainer categories={reducedCategories} />
      <div className='w-full columns-1 md:columns-2'>
        {projects.map((project) => (
          <ProjectAccordian key={project.id} projects={project} />
        ))}
      </div>
    </div>
  )
}

function TechnologiesContainer({ categories }: { categories: string[] }) {
  return (
    <div className='flex flex-col flex-wrap items-center gap-2  p-1'>
      <h2>Technologies</h2>
      <div className='flex flex-row flex-wrap items-center gap-2  p-1'>
        {categories.map((category) => {
          return (
            <div
              key={category}
              className='rounded-md border p-1 text-xs font-semibold leading-4 hover:underline'
            >
              {category}
            </div>
          )
        })}
      </div>
    </div>
  )
}
