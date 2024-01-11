import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { Project, projects } from '~/resources/projects'
import ProjectAccordian from '~/components/v2-components/project/project-accordian_v2'
import TechnologiesContainer from '~/components/v2-components/project/project-tech-container'
import { Separator } from '~/components/ui/separator'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return null
  }
  return json({ user })
}

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick's Projects`
    }
  ]
}

type Props = {
  projects: Project[]
}

export const ExtractUniqueCategories = ({ projects }: Props) => {
  // Extract categories from each project, flatten them into one array, and remove duplicates
  const uniqueCategories = Array.from(
    new Set(projects.flatMap((p) => p.categories.flatMap((c) => c.label)))
  )

  return uniqueCategories
}

export default function ProjectIndex() {
  // Additional logic to handle the unique categories list
  // ...
  const uniqueCategories = ExtractUniqueCategories({ projects })

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <div className='flex w-full flex-col gap-2'>
        <h1>Welcome to the Projects Page</h1>
        <Separator />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>
            Here are a number of coding Projects that I have completed
          </h6>
          S
        </div>
      </div>
      <TechnologiesContainer categories={uniqueCategories} />
      <div className='w-full columns-1 md:columns-2 gap-5'>
        {projects.map((project) => (
          <ProjectAccordian key={project.id} projects={project} />
        ))}
      </div>
    </div>
  )
}
