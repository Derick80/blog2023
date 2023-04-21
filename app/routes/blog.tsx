import { Divider } from '@mantine/core'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import formatRFC7231 from 'date-fns/esm/formatRFC7231'
import dayjs from 'dayjs'
import React from 'react'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import FavoriteContainer from '~/components/favorite-container'
import LikeContainer from '~/components/like-container'
import Tags from '~/components/tags'
import { getPosts } from '~/server/post.server'
import type { Post } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import Button from '~/components/button'
import { ShareButton } from '~/components/share-button'
import { ListComments } from '~/components/blog-ui/comments/comment-list'
dayjs.extend(relativeTime)
export async function loader({ request }: LoaderArgs) {
  const posts = await getPosts()

  return json({ posts })
}

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <div className='h- flex w-full flex-col items-center gap-4 border-2'>
      <h1 className='text-4xl font-semibold'>Blog</h1>
      <Outlet />
      <div>
        {posts.map((post) => (
          <BlogPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export function BlogPreview({ post }: { post: Post }) {
  const fetcher = useFetcher()
  const [open, setOpen] = React.useState(false)
  return (
    <div className='static flex w-full flex-col gap-2 border-2'>
      {/* Card header */}
      <div className='flex flex-row items-center gap-2'>
        <h1 className='text-4xl font-semibold'>{post.title}</h1>
      </div>
      {/* card content and image */}
      <div className='flex flex-row gap-2 border-2 border-red-500'>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className='w-1/2' />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      {/* tags container */}

      <Tags categories={post.categories} />
      {/* card footer */}
      <div className='flex flex-row items-center gap-2 border-2 border-green-500 p-1'>
        <LikeContainer
          postId={post.id}
          likeCounts={post.likes.length}
          likes={post.likes}
        />
        <FavoriteContainer favorites={post.favorites} postId={post.id} />
        <Button
          variant='ghost'
          size='tiny'
          onClick={() => {
            fetcher.load(`/blog/${post.id}/comment`)
            setOpen((prev) => !prev)
          }}
        >
          <ChatBubbleIcon />
          <p className='sub'>{post.comments.length}</p>
        </Button>
        <ShareButton id={post.id} />
        <div className='flex flex-grow' />
        <p>{dayjs(post.createdAt).fromNow()}</p>
      </div>
      {/* card actions */}
      <div className='flex flex-row gap-2 border-2 border-yellow-500'>
        <Actions postId={post.id} userId={post.user.id} />
      </div>
      <Divider />
      <CommentBox postId={post.id} />

      {open && fetcher.data && (
        <ListComments comments={(fetcher.data as any).comments} />
      )}
    </div>
  )
}

function Actions({
  postId,
  userId
}: {
  postId: Post['id']
  userId: Post['userId']
}) {
  const user = useOptionalUser()
  return (
    <div className='flex flex-row gap-2'>
      <Link to={`/blog/${postId}`}>View</Link>
      {user?.id === userId && (
        <>
          <Link to={`/blog/${postId}/edit`}>Edit</Link>
          <Form method='post' action={`/blog/${postId}/delete`}>
            <button type='submit'>Delete</button>
          </Form>
        </>
      )}
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
