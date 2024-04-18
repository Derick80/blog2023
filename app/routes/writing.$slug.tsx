import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { MDXProvider } from '@mdx-js/react'
import { useLoaderData } from '@remix-run/react'
import { frontmatterType } from './writing'
import { getFile } from '~/.server/markdown.server'
import { marked } from 'marked'
type PostModule = { [key: string]: unknown } // Unknown structure for now

export async function loader({ request, params }: LoaderFunctionArgs) {
    const slug = params.slug
    if (!slug) throw new Error('No slug found')
    console.log(slug, 'slug')

    const { frontmatter, content } = await getFile(slug)
    if (!frontmatter) throw new Error('No frontmatter found')
    if (!content) throw new Error('No content found')
    console.log(content, 'content')

    return json({ slug, content })
}

export default function SlugRoute() {
    const { content, slug } = useLoaderData<typeof loader>()

    return (
        <div className='flex flex-col items-center w-full h-full border-2'>
            <div
                className='flex flex-col  border-2 w-full p-2'
                dangerouslySetInnerHTML={{ __html: marked(content) }}
            />
            huhg
        </div>
    )
}
