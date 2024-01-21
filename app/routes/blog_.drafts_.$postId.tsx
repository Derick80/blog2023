import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import { BlogEditCard } from '~/components/blog-ui/post/blog-edit-card'
import PublishToggle from '~/components/blog-ui/post/publish-toggle'
import { getUserAndAdminStatus, isAuthenticated } from '~/server/auth/auth.server'
import { changePostFeaturedStatus, changePostPublishStatus, deletePost, updatePost } from '~/server/post.server'
import { prisma } from '~/server/prisma.server'
import { commitSession, getSession, setErrorMessage, setSuccessMessage } from '~/server/session.server'
import { validateAction2 as validateAction } from '~/utilities'

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

const intentSchema = z.object({
    intent: z.enum(['delete', 'publish', 'update', 'featured'])
})

type IntentInput = z.infer<typeof intentSchema>

const deleteSchema = z.object({
    intent: z.literal('delete'),
    postId: z.string()
})

type DeleteInput = z.infer<typeof deleteSchema>

const publishSchema = z.object({
    intent: z.literal('publish'),
    published: z.string().transform((val) => val === 'true' ? true : false),
    postId: z.string()

})

type PublishInput = z.infer<typeof publishSchema>

const toggleFeaturedSchema = z.object({
    intent: z.literal('featured'),
    featured: z.string().transform((val) => val === 'true' ? true : false),
    postId: z.string()

})


type ToggleFeaturedInput = z.infer<typeof toggleFeaturedSchema>

const updateSchema = z.object({
    intent: z.literal('update'),
    postId: z.string(),
    title: z.string().min(25, 'Title should be at least 25 characters').max(60),
    description: z
        .string()
        .min(25, 'Description should be at least 10 characters')
        .max(160, 'Description should be less than 160 characters'),
    imageUrl: z.string().url('Image URL should be a valid URL'),
    featured: z.string().transform((val) => val === 'true' ? true : false),
    content: z.string().min(1).max(50000),
    categories: z.string(),
})


const schema = z.discriminatedUnion('intent', [
    z.object({
        intent: z.literal('delete'),
        postId: z.string()
    }),
    z.object({
        intent: z.literal('publish'),
        postId: z.string(),
        published: z.string().transform((val) => val === 'true' ? true : false)
    }),
    z.object({
        intent: z.literal('featured'),
        postId: z.string(),
        featured: z.string().transform((val) => val === 'true' ? true : false)
    }),
    z.object({
        postId: z.string(),
        intent: z.literal('update'),
        title: z.string().min(25, 'Title should be at least 25 characters').max(60),
        description: z
            .string()
            .min(25, 'Description should be at least 10 characters')
            .max(160, 'Description should be less than 160 characters'),
        imageUrl: z.string().url('Image URL should be a valid URL').optional(),
        published: z.string().transform((val) => val === 'true' ? true : false),
        featured: z.string().transform((val) => val === 'true' ? true : false),
        content: z.string().min(1).max(50000),
        categories: z.string().optional()
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

    // const cloned = request.clone()

    // const { formData, errors } = await validateAction({
    //     request: cloned,
    //     schema: intentSchema
    // })
    // if (errors) {
    //     return json({ errors }, { status: 400 })
    // }

    // const { intent } = formData as IntentInput


    const { formData, errors } = await validateAction({
        request,
        schema
    })

    if (errors) {
        return json({ errors }, { status: 400 })
    }


    switch (formData.intent) {
        case 'publish':

            const publishStatus = await changePostPublishStatus({
                id: formData.postId,
                userId: user.id,
                published: formData.published
            })

            if (!publishStatus) throw new Error('Post not published')

            return json({ publishStatus })
        case 'delete':

            const deleteStatus = await deletePost({
                id: formData.postId,
                userId: user.id
            })

            if (!deleteStatus) { throw new Error('Post not deleted') }

            return setSuccessMessage(session, 'Post deleted'), redirect('/blog', {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            })

        case 'update':
            const updated = await updatePost({
                ...formData,
                slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                userId: user.id,

            })
            if (!updated) throw new Error('Post not updated')
            return setSuccessMessage(session, `Post ${updated.title} updated`), redirect(`/blog/${updated.id}`, {
                headers: {
                    'Set-Cookie': await commitSession(session)
                }
            })
        case 'featured':
            const featured = await changePostFeaturedStatus({
                id: formData.postId,
                userId: user.id,
                featured: formData.featured
            })

            if (!featured) throw new Error('Post not featured')
            return json({ featured })
        default:
            throw new Error('Invalid intent')

    }


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