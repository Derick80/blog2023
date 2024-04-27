import {
    ActionFunctionArgs,
    type LoaderFunctionArgs,
    json
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { getFile, getMDXFileContent } from '~/.server/mdx-compile.server'
import { bundleMDX } from 'mdx-bundler'
import React from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import HoverBar from '~/components/hover-bar'
import { getPostInformation, likeContent } from '~/.server/content.server'
import { z } from 'zod'
import { isAuthenticated } from './_auth+/auth.server'




// app/routes/writing.$slug_index.tsx
const relativePath = 'app/content/blog/'
const filePath = String([process.cwd() + '/' + relativePath ])

const slugSchema = z.object({
    slug: z.string()
})

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { slug } = slugSchema.parse(params)
console.log(filePath, 'filePath');

    if (!slug) throw new Error('No slug found')
const data = await getMDXFileContent(slug)
    // I use this to load the file.
    const {  content } = await getFile(slug)

    if (!content) throw new Error('No content found')

    // bundle the mdx file.  The rehypPrettyCode plugin is used to make the code blocks look nice but the remarkkMdxFrontmatter plugin is used to parse the frontmatter but the bundlemdx doesn't get the frontmatter
    const { code,frontmatter } = await bundleMDX({
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

            return {
                options,
                frontmatter
            }
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
    console.log(frontmatter, 'front');
    console.log(data,'data');


    const contentDetails = await getPostInformation(slug)
    if (!contentDetails) throw new Error('No content details found')
        console.log(contentDetails, 'contentDetails');

    return json({ slug,data, content, code, contentDetails })
}
const contentActionSchema = z.discriminatedUnion('intent', [
    z.object({
        intent: z.literal('like-content'),
        contentId: z.string()
    })
])

export type actionType = z.infer<typeof contentActionSchema>
export async function action({ request, params }: ActionFunctionArgs) {
    const user = await isAuthenticated(request)
    if (!user) {
        return json(
            { message: 'You must be logged in to like content' },
            { status: 401 }
        )
    }

    const userId = user.userId

    const formData = await request.formData()

    const { intent, contentId } = contentActionSchema.parse(
        Object.fromEntries(formData.entries())
    )
    console.log(contentId, userId, 'contentId, userId');

    const liked = await likeContent({ userId, contentId })
    if (!liked) throw new Error('No content found')
    return json({ liked })
}
export default function SlugRoute() {
    const actionData = useActionData<typeof action>()
    console.log(actionData, 'actionData')

    const { code,data, contentDetails } = useLoaderData<typeof loader>()
    const Component = React.useMemo(() => getMDXComponent(data.code), [data.code])

    return (
        <>
            <div >
                <HoverBar contentDetails={contentDetails} />
                <Component

                />
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
