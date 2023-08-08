import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import dayjs from 'dayjs'
import { getPosts } from '~/server/post.server'
import relativeTime from 'dayjs/plugin/relativeTime'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Post } from '~/server/schemas/schemas'
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

  const comments = posts.map((post: { comments: any }) => post.comments).flat()

  return json({ posts, comments })
}

export default function BlogRoute() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <h1 className='text-2xl font-bold'>Blog</h1>
      <div className='flex w-full flex-col items-center gap-2'>
        {data.posts.map((post: Post) => (
          <div key={post.id} className='flex w-full flex-col gap-2'></div>
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

//  ;<DropdownMenu.Root>
//    <DropdownMenu.Trigger className='inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-slate-900 focus:text-gray-500 focus:outline-none'>
//      <span className='sr-only'>Open options</span>
//      <HamburgerMenuIcon className='text-teal-400' />
//    </DropdownMenu.Trigger>
//    <DropdownMenu.Content className='z-10 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-900'>
//      <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-slate-700'>
//        <Link to='/blog/new'>New</Link>
//      </DropdownMenu.Item>
//      <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-slate-700'>
//        <Link to='/drafts'>Drafts</Link>
//      </DropdownMenu.Item>
//    </DropdownMenu.Content>
//  </DropdownMenu.Root>
