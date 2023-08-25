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
import { useCategories } from '~/utilities'
import SeparatorV2 from '~/components/v3-components/separator_v2'
import CategoryContainer from '~/components/v3-components/blog-ui/category_v2'
dayjs.extend(relativeTime)

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader({ request }: LoaderArgs) {
  // I don't need to use the posts from the loader because I'm using the posts from the getAllPostsV1 function but at the moment I'm using the old getPosts function to get the comments
  // get all posts and comments
  const posts = await getPosts()
  // isolate all comments from posts and flatten them into one array for use with useMatchesData

  const comments = posts.map((post) => post.comments).flat()

  const posts_v2 = await getAllPostsV1()

  return json({ posts, comments, posts_v2 })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()
  const categories = useCategories()

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <div className='flex flex-col items-center gap-20 '>
        <h1>Welcome to the Blog for DerickCHoskinson.com </h1>
        <h4>
          <b>Writings</b> about my projects as a novice web developer but mostly
          fake posts used to test the blog
        </h4>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <SeparatorV2 orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>You can still browse the Blog by </h6>
          <h1>Category</h1>
        </div>
        {categories && <CategoryContainer categories={categories} />}
      </div>
      <div className='bg-violet flex w-full flex-col items-center gap-2'>
        <Outlet />
        <SeparatorV2 orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>Browse all the </h6>
          <h1>Blog Posts</h1>
        </div>

        <div className='flex flex-col gap-5'>
          {data.posts_v2.map((post) => (
            <BlogPreviewV2 key={post.id} post={post} />
          ))}
        </div>
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
