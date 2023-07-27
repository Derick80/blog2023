import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError
} from '@remix-run/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
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
import { ChatBubbleIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import Button from '~/components/button'
import { ShareButton } from '~/components/share-button'
import CommentContainer from '~/components/blog-ui/comments/comment-list'
import { ColBox } from '~/components/boxes'
import VerticalMenu from '~/components/vertical-menu'
import BlogCard from '~/components/gpt-blogcard'
dayjs.extend(relativeTime)

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader({ request }: LoaderArgs) {
  const posts = await getPosts()
  const comments = posts.map((post: { comments: any }) => post.comments).flat()

  return json({ posts, comments })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()
  console.log(data, 'data from blog route')

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-slate-900 focus:text-gray-500 focus:outline-none'>
          <span className='sr-only'>Open options</span>
          <HamburgerMenuIcon className='text-teal-400' />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className='z-10 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-900'>
          <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-gray-100'>
            <Link to='/blog/new'>New</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-gray-100'>
            <Link to='/drafts'>Drafts</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {data && data.posts.map((post) => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}

export function BlogPreview({ post }: { post: Post }) {
  const navigate = useNavigation()
  const user = useOptionalUser()
  const currentUser = user?.id
  const [open, setOpen] = React.useState(false)
  return (
    <div
      className={
        navigate.state === 'loading'
          ? 'opacity-25 transition-opacity delay-200'
          : 'static flex w-full flex-col gap-2 rounded-md border-2'
      }
    >
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
