import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import dayjs from 'dayjs'
import { getAllPostsV1, getPosts } from '~/server/post.server'
import relativeTime from 'dayjs/plugin/relativeTime'
import BlogPreviewV2 from '~/components/v3-components/blog-ui/blog-post/blog-preview_v2'
dayjs.extend(relativeTime)

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader({ request }: LoaderArgs) {
  // get all posts and comments
  const posts = await getPosts()
  // isolate all comments from posts and flatten them into one array for use with useMatchesData

  const comments = posts.map((post) => post.comments).flat()

  const posts_v2 = await getAllPostsV1()

  return json({ posts, comments, posts_v2 })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <h1>Blog</h1>

      <div className='bg-violet flex w-full flex-col items-center gap-2'>
        <Outlet />
        {data.posts.map((post) => (
          <BlogPreviewV2 key={post.id} post={post} />
        ))}
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
