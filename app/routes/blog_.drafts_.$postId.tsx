import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogEditCard from '~/components/blog-ui/post/blog-edit-card'
import BlogEditContextProvider, {
  BlogEditContext
} from '~/components/blog-ui/post/creation-context'
import PublishToggle from '~/components/blog-ui/post/publish-toggle'
import {
  getUserAndAdminStatus,
  isAuthenticated
} from '~/server/auth/auth.server'
import {
  changePostFeaturedStatus,
  changePostPublishStatus,
  deletePost,
  updatePost
} from '~/server/post.server'
import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { validateAction2 as validateAction } from '~/utilities'

export async function loader({ request, params }: LoaderFunctionArgs) {
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

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('delete'),
    postId: z.string()
  }),
  z.object({
    intent: z.literal('publish'),
    postId: z.string(),
    published: z.string().transform((val) => (val === 'true' ? true : false))
  }),
  z.object({
    intent: z.literal('featured'),
    postId: z.string(),
    featured: z.string().transform((val) => (val === 'true' ? true : false))
  }),
  z.object({
    intent: z.literal('updateCategories'),
    postId: z.string(),
    categories: z.string()
  }),
  z.object({
    postId: z.string(),
    intent: z.literal('update'),
    title: z.string().min(25, 'Title should be at least 25 characters').max(60),
    description: z
      .string()
      .min(25, 'Description should be at least 10 characters')
      .max(160, 'Description should be less than 160 characters'),

    published: z.string().transform((val) => (val === 'true' ? true : false)),
    featured: z.string().transform((val) => (val === 'true' ? true : false)),
    content: z.string().min(1).max(50000)
  }),
  z.object({
    intent: z.literal('new-category'),
    postId: z.string(),
    newCategory: z.string().min(3).max(20)
  })
])

export type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionFunctionArgs) {
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

      if (!deleteStatus) {
        throw new Error('Post not deleted')
      }

      return (
        setSuccessMessage(session, 'Post deleted'),
        redirect('/blog', {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        })
      )

    case 'update':
      const updated = await updatePost({
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        userId: user.id
      })
      if (!updated) throw new Error('Post not updated')
      return (
        setSuccessMessage(session, `Post ${updated.title} updated`),
        redirect(`/blog/${updated.id}`, {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        })
      )
    case 'featured':
      const featured = await changePostFeaturedStatus({
        id: formData.postId,
        userId: user.id,
        featured: formData.featured
      })

      if (!featured) throw new Error('Post not featured')
      return json({ featured })
    case 'new-category':
      const newValue = formData.newCategory
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
      // check if the category already exists
      const categoryExists = await prisma.category.findUnique({
        where: { value: newValue }
      })
      if (categoryExists) throw new Error('Category already exists')

      const newCategory = await prisma.post.update({
        where: { id: formData.postId },
        data: {
          categories: {
            connectOrCreate: {
              where: {
                value: formData.newCategory
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
              },
              create: {
                value: formData.newCategory
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-'),
                label: formData.newCategory
              }
            }
          }
        }
      })
      if (!newCategory) throw new Error('Category not created')
      return json({ newCategory })

    default:
      throw new Error('Invalid intent')
  }
}

export default function DraftsRoute() {
  const { post } = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: ActionInput }>()

  return (
    <div className='flex flex-col items-center gap-2 border-2'>
      <BlogEditCard post={post} />
    </div>
  )
}
