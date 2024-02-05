import { ChevronLeftIcon } from '@radix-ui/react-icons'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import BlogFullView from '~/components/blog-ui/post/blog-full-view'
import { isAuthenticated } from '~/server/auth/auth.server'
import {
  createComment,
  editCommentMessage,
  replyToComment
} from '~/server/comment.server'
import { getSinglePostById } from '~/server/post.server'
import { prisma } from '~/server/prisma.server'
import type { Comment, Post } from '~/server/schemas/schemas'
import { commitSession, getSession, setSuccessMessage } from '~/server/session.server'
import { validateAction2 as validateAction } from '~/utilities'
export async function loader({ params }: LoaderFunctionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await getSinglePostById(postId)

  if (!post) {
    throw new Error('Post not found')
  }

  // Isolate the comments from the post object for later use in a fetcher
  const postComments = post.comments

  // remove the comments with parentId from the post object
  post.comments = post.comments.filter((comment) => !comment.parentId)

  return json({ post, comments: postComments})

}
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.post?.title },
    {
      name: data?.post?.description,
      content: data?.post?.content.substring(0, 160)
    }
  ]
}

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('create-comment'),
    parentId: z.string().optional(),
    message: z.string().min(1).max(250)
  }),
  z.object({
    intent: z.literal('edit-comment'),
    message: z.string().min(1).max(250),
    commentId: z.string()
  }),
  z.object({
    intent: z.literal('reply-comment'),
    commentId: z.string(),
    message: z.string().min(1).max(250)
  }),
  z.object({
    intent: z.literal('like'),
    method: z.enum(['post', 'delete'])

  })
])

export type ActionInput = z.infer<typeof schema>

export async function action({ request, params }: LoaderFunctionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ error: 'Not authenticated' })
  }
  const session = await getSession(request.headers.get('Cookie'))
  const { formData, errors } = await validateAction({
    request,
    schema
  })

  if (errors) {
    return json({ errors }, { status: 400 })
  }

  switch (formData.intent) {
    case 'create-comment':
      const comment = await createComment({
        postId,
        message: formData.message,
        parentId: formData?.parentId,
        userId: user.id
      })
      if (!comment) throw new Error('Comment not created')

      return json({ comment })

    case 'edit-comment':
      const updatedComment = await editCommentMessage({
        message: formData.message,
        commentId: formData.commentId,
        userId: user.id
      })
      if (!updatedComment) throw new Error('Comment not updated')

      return json({ message: 'ok' })

    case 'reply-comment':
      const replyComment = await replyToComment({
        postId,
        message: formData.message,
        parentId: formData.commentId,
        userId: user.id
      })
      if (!replyComment) throw new Error('Comment not created')

      return json({ message: 'ok' })

    case 'like':

      try {
        if (formData.method === 'post') {
          // like the post
          const liked = await prisma.like.create({
            data: {
              postId,
              userId: user.id
            }
          })
          if (!liked) throw new Error('could not like post')
          if (liked) {
            setSuccessMessage(session, 'successMessage liked')
          }
        }
        if (formData.method === 'delete') {
          // unlike the post
          const unliked = await prisma.like.delete({
            where: {
              postId_userId: {
                postId,
                userId: user.id
              }
            }
          })
          if (!unliked) throw new Error('could not delete like')
          if (unliked) {
            setSuccessMessage(session, 'successMessage unliked')
          }
        }

        return json({ message: 'ok' },
          {
            headers: {
              'Set-Cookie': await commitSession(session)
            }
          }
        )
      } catch (error) {
        return json({ error: 'invalid like data' }, { status: 500 })

  }
      }

}
export default function BlogPostRoute() {
  const data = useLoaderData<{
    post: Post
    comments: Comment[]
  }>()

  return (
    <div className='mx-auto h-full  w-full items-center gap-4'>
      {/* create a back button */}
      <NavLink
        title='Go Back'
        className='flex flex-row items-center gap-1'
        to='/blog'
      >
        <ChevronLeftIcon className='text-primary' />
        Back
      </NavLink>
      <div className='flex flex-col h-full min-h-full items-center gap-4'>
        <BlogFullView post={data.post} />
      </div>
    </div>
  )
}
export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h2>Status:{error.status}</h2>
        <p>{error.data.message}</p>
      </div>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <div>
      <p className='scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl'>
        uh Oh..
      </p>
      <p>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
