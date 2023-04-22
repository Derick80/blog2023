import { Divider } from '@mantine/core'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import dayjs from 'dayjs'
import React from 'react'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import FavoriteContainer from '~/components/favorite-container'
import LikeContainer from '~/components/like-container'
import Tags from '~/components/tags'
import { getPosts } from '~/server/post.server'
import type { CommentWithChildren, Post } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Button from '~/components/button'
import { ShareButton } from '~/components/share-button'
import CommentContainer from '~/components/blog-ui/comments/comment-list'
import { ColBox } from '~/components/boxes'
import VerticalMenu from '~/components/vertical-menu'
import BlogCard from '~/components/blog-ui/blog-card'
dayjs.extend(relativeTime)
export async function loader({ request }: LoaderArgs) {
  const posts = await getPosts()
  const comments = await posts.map((post) => post.comments).flat()

  return json({ posts, comments })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className='h- flex w-full flex-col items-center gap-2'>
      <h1 className='text-4xl font-semibold'>Blog</h1>

      {data.posts.map((post) => (
        <BlogCard key={post.id} post={post}>
          <CommentBox postId={post.id} />
        </BlogCard>
      ))}
    </div>
  )
}

export type BlogPreviewProps = {
  post: Post
  comments: CommentWithChildren[]
}

export type BlogPreviewPropstwo = {
  post: Post
}

export function BlogPreview({ post }: { post: Post }) {
  const user = useOptionalUser()
  const currentUser = user?.id
  const [open, setOpen] = React.useState(false)
  return (
    <div className='static flex w-full flex-col gap-2 rounded-md border-2'>
      {/* Card header */}
      <div className='gap- flex flex-row items-center'>
        <h1 className='text-xl font-semibold'>{post.title}</h1>
      </div>
      {/* card content and image */}
      <div className='flex w-full flex-row gap-2'>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className='w-1/2' />
        )}
        <div
          className='w-1/2'
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      {/* tags container */}
      <div className='flex flex-row flex-wrap'>
        <Tags categories={post.categories} />
      </div>
      {/* card footer */}
      <div className='flex flex-row items-center gap-2 border-2 border-green-500 p-1'>
        {post.likes && post.favorites && (
          <div className='flex flex-row items-center gap-2'>
            <LikeContainer
              postId={post.id}
              likeCounts={post.likes.length}
              likes={post.likes}
            />
            <FavoriteContainer favorites={post.favorites} postId={post.id} />
          </div>
        )}
        {post.comments && (
          <Button
            variant='ghost'
            size='tiny'
            onClick={() => {
              setOpen(!open)
            }}
          >
            <ChatBubbleIcon />
            {post.comments && (
              <p className='sub'>{post.comments.length}</p>
            )}{' '}
          </Button>
        )}
        <ShareButton id={post.id} />
        <div className='flex flex-grow' />
        {currentUser === post.user.id && (
          <VerticalMenu>
            <Link to={`/blog/${post.id}`}>View</Link>
            <Link to={`/blog/${post.id}/edit`}>Edit</Link>
            <Form method='post' action={`/blog/${post.id}/delete`}>
              <button type='submit'>Delete</button>
            </Form>
          </VerticalMenu>
        )}
        <p>{dayjs(post.createdAt).fromNow()}</p>
      </div>

      <Divider />
      <ColBox className='px-1'>
        <CommentBox postId={post.id} />
        {open && <CommentContainer postId={post.id} />}
      </ColBox>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h1>Status:{error.status}</h1>
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
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
