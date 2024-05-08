import {
    ActionFunctionArgs,
    type LoaderFunctionArgs,
    json
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { getMDXFileContent } from '~/.server/mdx-compile.server'
import React from 'react'
import HoverBar from '~/components/hover-bar'
import { getContentInfoFromDB, likeContent } from '~/.server/content.server'
import { z } from 'zod'
import { isAuthenticated } from './_auth+/auth.server'
import {  useMdxComponent } from '~/lib/functions'


const slugSchema = z.object({
    slug: z.string()
})

// Might do a promise.all here?
export async function loader({ request, params }: LoaderFunctionArgs) {
    const { slug } = slugSchema.parse(params)

    if (!slug) throw new Error('No slug found')
    const data = await getMDXFileContent(slug)
    if (!data) throw new Error('No data found')

    const contentDetails = await getContentInfoFromDB(slug)
    if (!contentDetails) throw new Error('No content details found')
    console.log(contentDetails, 'contentDetails')

    return json({ slug, data, contentDetails })
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
    console.log(contentId, userId, 'contentId, userId')

    const liked = await likeContent({ userId, contentId })
    if (!liked) throw new Error('No content found')
    return json({ liked })
}
export default function SlugRoute() {
    const actionData = useActionData<typeof action>()
    console.log(actionData, 'actionData')

    const { data, contentDetails } = useLoaderData<typeof loader>()


    const Component = useMdxComponent(data.code)

    return (


                <div
                    className=' border-2 w-full'>
                      <HoverBar contentDetails={ contentDetails } />
            <div
            className='flex flex-col gap-5'>
                <Component />
            </div>
                    </div>



    )
}
const Paragraph: React.FC<{ children: React.ReactNode }> = (props) => {
    if (typeof props.children !== 'string' && props.children === 'img') {
        return <>{props.children}</>
    }

        return <p
                className = 'text-3xl text-purple-500'
            {  ...props } />
}

const Code = (props:string) => {

    return (
        <code

        >
            {props}
            </code>
    )
}