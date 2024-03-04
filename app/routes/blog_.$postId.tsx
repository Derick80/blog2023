import { ChevronLeftIcon } from '@radix-ui/react-icons'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { defer, json, redirect } from '@remix-run/node'
import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import React from 'react'
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
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { validateAction2 as validateAction } from '~/utilities'
import formatComments from './format-comments'
import { H2 } from '~/components/ui/typography'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await getSinglePostById(postId)

  if (!post) {
    throw new Error('Post not found')
  }

  console.log(post, 'post')

  const allComments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true
        }
      },
      likes: {
        select: {
          userId: true,
          commentId: true
        }
      },
      children: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          likes: {
            select: {
              userId: true,
              commentId: true
            }
          }
        }
      }
    }
  })

  console.log(allComments, 'allComments')

  const comments = formatComments(allComments)

  return defer({
    postPath: request.url,
    post,
    comments
  })
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
    intent: z.literal('create-top-level-comment'),
    parentId: z.string().optional(),
    message: z.string().min(1).max(10000)
  }),
  z.object({
    intent: z.literal('edit-comment'),
    message: z.string().min(1).max(10000),
    commentId: z.string()
  }),
  z.object({
    intent: z.literal('create-comment-reply'),
    parentId: z.string(),
    postId: z.string(),
    message: z.string().min(1).max(10000)
  }),
  z.object({
    intent: z.literal('delete-comment'),
    commentId: z.string()
  }),
  z.object({
    intent: z.literal('like-comment'),
    commentId: z.string()
  }),
  z.object({
    intent: z.literal('like'),
    method: z.enum(['post', 'delete'])
  }),
  z.object({
    intent: z.literal('favorite'),
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
    case 'create-top-level-comment':
      const comment = await createComment({
        postId,
        message: formData.message,
        userId: user.id
      })
      if (!comment) setErrorMessage(session, 'errorMessage createComment')
      if (comment) setSuccessMessage(session, 'successMessage createComment')

      return json({ comment })

    case 'edit-comment':
      const updatedComment = await editCommentMessage({
        message: formData.message,
        commentId: formData.commentId,
        userId: user.id
      })
      if (!updatedComment) {
        setErrorMessage(session, 'errorMessage editComment')
      }
      if (updatedComment) {
        setSuccessMessage(session, 'successMessage editComment')
      }

      return json(
        { message: 'ok', updatedComment },
        {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        }
      )

    case 'create-comment-reply':
      const replyComment = await replyToComment({
        postId,
        message: formData.message,
        parentId: formData.parentId,
        userId: user.id
      })
      if (!replyComment) {
        setErrorMessage(session, 'errorMessage replyComment')
      }
      if (replyComment) {
        setSuccessMessage(session, 'successMessage replyComment')
      }

      return json({ message: 'ok' })

    case 'delete-comment':
      try {
        const deleted = await prisma.comment.delete({
          where: {
            id: formData.commentId
          }
        })
        if (!deleted) throw new Error('could not delete comment')
        if (deleted) {
          setSuccessMessage(session, 'successMessage deleteComment')
        }
        return redirect(`/blog/${postId}`, {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        })
      } catch (error) {
        return json({ error: 'invalid delete data' }, { status: 500 })
      }
    case 'like-comment':
      const isLiked = await prisma.commentLike.findUnique({
        where: {
          commentId_userId: {
            commentId: formData.commentId,
            userId: user.id
          }
        }
      })
      if (!isLiked) {
        // like the comment
        const liked = await prisma.commentLike.create({
          data: {
            commentId: formData.commentId,
            userId: user.id
          }
        })
        return json({ message: 'ok' })
      }
      if (isLiked) {
        // unlike the comment
        const unliked = await prisma.commentLike.delete({
          where: {
            commentId_userId: {
              commentId: formData.commentId,
              userId: user.id
            }
          }
        })
        return json({ message: 'ok' })
      }

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

        return json(
          { message: 'ok' },
          {
            headers: {
              'Set-Cookie': await commitSession(session)
            }
          }
        )
      } catch (error) {
        return json({ error: 'invalid like data' }, { status: 500 })
      }
    case 'favorite':
      try {
        if (formData.method === 'post') {
          // favorite the post
          const favorited = await prisma.favorite.create({
            data: {
              postId,
              userId: user.id
            }
          })
          if (!favorited) throw new Error('could not favorite post')
          if (favorited) {
            setSuccessMessage(session, 'successMessage favorited')
          }
        }
        if (formData.method === 'delete') {
          // unfavorite the post
          const unfavorited = await prisma.favorite.delete({
            where: {
              postId_userId: {
                postId,
                userId: user.id
              }
            }
          })
          if (!unfavorited) throw new Error('could not delete favorite')
          if (unfavorited) {
            setSuccessMessage(session, 'successMessage unfavorited')
          }
        }
        return json(
          { message: 'ok' },
          {
            headers: {
              'Set-Cookie': await commitSession(session)
            }
          }
        )
      } catch (error) {
        return json({ error: 'invalid favorite data' }, { status: 500 })
      }
  }
}
export default function BlogPostRoute() {
  const { post, comments } = useLoaderData<typeof loader>()
  const [isDeleteOpen, setDeleteOpen] = React.useState(false)

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
        <BlogFullView />
      </div>
    </div>
  )
}
const ErrorBoundary = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>Oops! Error</h1>
        <p className='text-lg text-red-700'>{`Status: ${error.status}`}</p>
        <p className='text-lg text-red-700'>{error.data.message}</p>
      </div>
    )
  }

  let errorMessage = 'Unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-bold text-red-600 mb-4'>Uh oh...</h1>
      <h2 className='text-xl font-semibold text-red-700 mb-4'>
        Something went wrong
      </h2>
      <pre className='text-lg text-red-700 whitespace-pre-wrap'>
        {errorMessage}
      </pre>
    </div>
  )
}
