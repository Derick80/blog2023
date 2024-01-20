import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { BlogEditCard } from '~/components/blog-ui/post/blog-edit-card'
import PublishToggle from '~/components/blog-ui/post/publish-toggle'
import { getUserAndAdminStatus, isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import { commitSession, getSession, setErrorMessage } from '~/server/session.server'
import { validateAction } from '~/utilities'

export async function loader ({ request, params }: LoaderFunctionArgs) {
    const { postId } = zx.parseParams(params, {
        postId: z.string()
    })

    const { user, isAdmin } = await getUserAndAdminStatus(request)
    if (!user || isAdmin === false) {
        return redirect('/login')
    }

    const post = await prisma.post.findUnique({
        where: { id: postId, userId: user.id },
        include: {
            categories: true,
            postImages: true
        }
    })

    if (!post) throw new Error('No post found')



    return json({ post })
}

const publishSchema = z.object({
    published: z.string().transform((val) => val === 'true' ? true : false),
    postId: z.string()

})

type ActionPublishInput = z.infer<typeof publishSchema>

const schema = z.discriminatedUnion('intent', [
    z.object({
        intent: z.literal('delete'),
        postId: z.string()
    }),
    z.object({
        intent: z.literal('publish'),
        postId: z.string(),
        published: z.string().transform((val) => val === 'true' ? true : false
        )
    }),
    z.object({
        intent: z.literal('update'),
        title: z.string().min(25, 'Title should be at least 25 characters').max(60),
        description: z
            .string()
            .min(25, 'Description should be at least 10 characters')
            .max(160, 'Description should be less than 160 characters'),
        imageUrl: z.string().url('Image URL should be a valid URL'),
        featured: z.coerce.boolean(),
        content: z.string().min(1).max(50000),
        categories: z.string(),
    })
])

export type ActionInput = z.infer<typeof schema>
export async function action ({ request, params }: ActionFunctionArgs) {

    // get the session from the request for toast messages
    const session = await getSession(request.headers.get('Cookie'))

    // check if the user is authenticated
    const user = await isAuthenticated(request)
    if (!user) {
        setErrorMessage(session, 'You must be logged in as an admin to do that')
        return redirect('/login', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        })
    }
    const formData = await request.clone().formData()

    const intent = formData.get('intent')
    const published = formData.get('published')
    console.log(published, 'published');


    console.log(intent, 'intent');



    if (intent === 'publish') {
        const { formData, errors } = await validateAction({
            request,
            schema: publishSchema
        })
        if (errors) {
            return json(errors, { status: 400 })
        }
        const { published, postId } = formData as ActionPublishInput
        console.log(published, postId, 'in server action');

        const publishStatus = await prisma.post.update({
            where: {
                id: postId,
                userId: user.id
            },
            data: {
                published: published
            }
        })

        return json({ publishStatus })

    }

    return json({ message: 'no action' })

}




export default function DraftsRoute () {
    const { post } = useLoaderData<typeof loader>()
    const actionData = useActionData<{ errors: ActionInput }>()

    return (
        <div className='flex w-full flex-col items-center gap-2'>

            <BlogEditCard post={ post } />
        </div>
    )


}