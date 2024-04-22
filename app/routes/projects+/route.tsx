import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getAllProjects } from '~/.server/project.server'
import CreateProjectComponent from '~/content/projects/create-project'

export async function loader({ request }: LoaderFunctionArgs) {
    return json({
        projects: 'projects'
    })
}

export default function ProjectRoute() {
    return (
        <div className=''>
            <CreateProjectComponent />
        </div>
    )
}
