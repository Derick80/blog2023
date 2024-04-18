import { type LoaderFunctionArgs, json } from '@remix-run/node'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'
import { bundleMDX } from '../.server/markdown.server'
import rehypePrettyCode from 'rehype-pretty-code'
// import Markdown from 'react-markdown'
import * as React from 'react'

type PostModule = { [key: string]: unknown } // Unknown structure for now

export async function loader({ request, params }: LoaderFunctionArgs) {
    const slug = params.slug
    if (!slug) throw new Error('N o slug found')
    const result = await bundleMDX({
        file: `../../content/blog/${slug}.mdx`,
        cwd: '/app/content/blog',


            }

    )
    const { code, frontmatter } = result
console.log(code, 'code');

    const community =  import.meta.glob(`../content/blog/community.mdx`)
    console.dir(community, 'community');
    console.log(Reflect.ownKeys(community));


    return json({ community, code, frontmatter })
}

export default function SlugRoute() {
    const { code } = useLoaderData<typeof loader>()

    const Component = React.useMemo(() => getMDXComponent(code), [code])

    return (
        <div className='border-2 w-full overflow-hidden'>
            <Component />
            <h1>Writing</h1>
        </div>
    )
}
