import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Scripts, useLoaderData } from '@remix-run/react'
import { getResume } from '~/.server/resume.server'
import ResumeCard from './resume-card'
import { useNonce } from '~/lib/nonce-provider'
export const meta: MetaFunction = () => {
    return [
        { title: `Derick Hoskinson's curriculum vitae` },
        { name: 'description', content: 'My current resume' }
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const cv = await getResume()
    if (!cv) throw new Error('No resume found')

    return json({ cv })
}

export default function ProjectRoute() {
    const { cv } = useLoaderData<typeof loader>()

    return (
        <div className=''>
            <ResumeCard cv={cv} />
        </div>
    )
}

export function ErrorBoundary() {
    // the nonce doesn't rely on the loader so we can access that
    const nonce = useNonce()

    // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
    // likely failed to run so we have to do the best we can.
    // We could probably do better than this (it's possible the loader did run).
    // This would require a change in Remix.

    // Just make sure your root route never errors out and you'll always be able
    // to give the user a better UX.

    return (
        <div className='text-red-500'>
            <h1>Something went wrong At the Projects Route</h1>
            <p>Sorry about that. Please try again.</p>
            <Scripts nonce={nonce} />
        </div>
    )
}
