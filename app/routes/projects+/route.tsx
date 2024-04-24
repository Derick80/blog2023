import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getAllProjects } from '~/.server/project.server'
import { useOptionalUser } from '~/lib/functions'
import CreateProjectComponent from '~/routes/projects+/create-project'
import ProjectCard from '~/routes/projects+/project-card'

export async function loader({ request }: LoaderFunctionArgs) {
    const projects = await getAllProjects()
    if (!projects) throw new Error('No projects found')

    return json({
        projects
    })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    return json({ message: 'Project Created' })
}

export default function ProjectRoute() {
    const { projects } = useLoaderData<typeof loader>()
    const user = useOptionalUser()
    const isAdmin = user?.role === 'ADMIN'

    return (
        <div className='flex flex-row flex-wrap md:flex-col gap-2 items-centser w-full h-full mx-suto'>
            {isAdmin && <CreateProjectComponent />}
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}
