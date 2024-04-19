import {
    ActionFunctionArgs,
    type LoaderFunctionArgs,
    json
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { getFile } from '~/.server/markdown.server'
import { bundleMDX } from 'mdx-bundler'
import React from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import HoverBar from '~/components/hover-bar'
import { getPostInformation, likeContent } from '~/.server/content.server'
import { z } from 'zod'

// app/routes/writing.$slug_index.tsx
const relativePath = 'app/content/blog/'
const filePath = String([process.cwd(), relativePath, +'*/tsx'])


const slugSchema = z.object({
    slug: z.string()
})

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { slug } = slugSchema.parse(params)
    if (!slug) throw new Error('No slug found')

    // I use this to load the file.
    const { frontmatter, content } = await getFile(slug)

    if (!frontmatter) throw new Error('No frontmatter found')
    if (!content) throw new Error('No content found')

    const { code } = await bundleMDX({
        source: content,
        cwd: filePath,
        mdxOptions(options, frontmatter) {
            // this is the recommended way to add custom remark/rehype plugins:
            // The syntax might look weird, but it protects you in case we add/remove
            // plugins in the future.
            options.remarkPlugins = [
                ...(options.remarkPlugins ?? []),
                remarkMdxFrontmatter
            ]
            options.rehypePlugins = [
                ...(options.rehypePlugins ?? []),
                rehypePrettyCode
            ]

            return options
        },
        // I don't think these are actually doing anything
        esbuildOptions: (options) => {
            options.loader = {
                ...options.loader,
                '.mdx': 'text',
                '.tsx': 'tsx'
            }
            return options
        }
    })
    const contentDetails = await getPostInformation(slug)
    if (!contentDetails) throw new Error('No content details found')

    return json({ slug, content, code, contentDetails })
}
const contentActionSchema = z.discriminatedUnion('intent', [
    z.object({
        intent: z.literal('like-content'),
        contentId: z.string(),
        userId: z.string().min(1).max(10000)
    })
])

export type actionType = z.infer<typeof contentActionSchema>
export async function action ({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData()

    const { intent,userId,contentId } = contentActionSchema.parse(Object.fromEntries(formData.entries()))

    const result = await likeContent({ userId, contentId })
    if (!result) return json({ message: 'error' }, { status: 500 })

    return json({ message: 'success' }, { status: 200 })
}
export default function SlugRoute () {
    const actionData = useActionData<typeof action>()
    console.log(actionData, 'actionData');


    const { code, contentDetails } = useLoaderData<typeof loader>()
    const Component = React.useMemo(() => getMDXComponent(code), [code])

    return (
        <>
            <div className='prose w-screen py-[1em] px-[2em] dark:prose-invert md:prose-lg lg:prose-xl prose-headings:text-text-primary prose-a:no-underline prose-pre:p-0 dark:prose-headings:text-d-text-primary'>
                <HoverBar contentDetails={contentDetails} />
                <Component />
            </div>
        </>
    )
}

// mdxOptions(options, frontmatter) {
//     // this is the recommended way to add custom remark/rehype plugins:
//     // The syntax might look weird, but it protects you in case we add/remove
//     // plugins in the future.
//     options.remarkPlugins = [
//         ...(options.remarkPlugins ?? []),
//         remarkMdxFrontmatter
//     ]
//     options.rehypePlugins = [
//         ...(options.rehypePlugins ?? []),
//         rehypePrettyCode
//     ]

//     return options
// }
//         })
