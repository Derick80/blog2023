import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/node'
import {
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useRouteError,
  useSearchParams
} from '@remix-run/react'
import dayjs from 'dayjs'
import { getAllPostsV1, getPosts } from '~/server/post.server'
import relativeTime from 'dayjs/plugin/relativeTime'
import BlogPreviewV2 from '~/components/v2-components/blog-ui/blog-post/blog-preview_v2'
import {
  filterPosts,
  useCategories,
  useOptionalUser,
  useUpdateQueryStringValueWithoutNavigation
} from '~/utilities'
import SeparatorV2 from '~/components/v2-components/separator_v2'
import React from 'react'
import CustomCheckbox from '~/components/v2-components/custom-checkbox_v2'

dayjs.extend(relativeTime)

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  // I don't need to use the posts from the loader because I'm using the posts from the getAllPostsV1 function but at the moment I'm using the old getPosts function to get the comments
  // get all posts and comments
  const posts = await getPosts()
  // isolate all comments from posts and flatten them into one array for use with useMatchesData

  const comments = posts.map((post) => post.comments).flat()

  const posts_v2 = await getAllPostsV1()

  return json({ posts, comments, posts_v2 })
}

export default function BlogRoute() {
  const user = useOptionalUser()
  const isAdmin = user?.role === 'ADMIN'
  const { posts_v2 } = useLoaderData<typeof loader>()
  const categories = useCategories()

  const [searchParams] = useSearchParams()

  const [queryValue, setQuery] = React.useState<string>(() => {
    return searchParams.get('q') ?? ''
  })
  const query = queryValue.trim()

  useUpdateQueryStringValueWithoutNavigation('q', query)

  const matchingPosts = React.useMemo(() => {
    if (!query) return posts_v2

    let filteredPosts = posts_v2
    return filterPosts(filteredPosts, query)
  }, [query, posts_v2])

  const isSearching = query.length > 0

  const visibleTags = isSearching
    ? new Set(
        matchingPosts.flatMap((post) =>
          post.categories.map((p) => p.value).filter(Boolean)
        )
      )
    : new Set(categories.map((p) => p.value))

  function toggleTag(tag: string) {
    setQuery((q) => {
      const expression = new RegExp(`\\b${tag}\\b`, 'ig')

      const newQuery = expression.test(q)
        ? q.replace(expression, '')
        : `${q} ${tag}`

      return newQuery.replace(/\s+/g, ' ').trim()
    })
  }

  return (
    <div className='flex w-full flex-col items-center gap-2'>
      {isAdmin && (
        <div className='flex flex-col items-center gap-2'>
          <h1>Admin Controls</h1>
        </div>
      )}
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
          <h6 className='text-left'>You can browse the Blog by </h6>
          <h1>Category</h1>
        </div>{' '}
        <div className='col-span-full -mb-4 -mr-4 flex flex-wrap lg:col-span-10'>
          {categories.map((category) => {
            const selected = query.includes(category.value)
            return (
              <CustomCheckbox
                key={category.id}
                name='category'
                tag={category.value}
                selected={selected}
                onClick={() => toggleTag(category.value)}
                disabled={!visibleTags.has(category.value)}
              />
            )
          })}
        </div>
      </div>
      <div className='bg-violet flex w-full flex-col items-center gap-2'>
        <Outlet />
        <SeparatorV2 orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          {!queryValue ? (
            <>
              <h6 className='text-left'>Viewing all the </h6>
              <h1>Blog Posts</h1>
            </>
          ) : (
            <div className='flex flex-row items-center gap-2 flex-wrap'>
              <h6 className='text-left'>
                Viewing Blog Posts with the category(ies)
              </h6>
              {queryValue.split(' ').map((tag) => (
                <h1 key={tag} className='text-primary'>
                  {tag}
                </h1>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col gap-5 w-full items-center'>
          {matchingPosts?.map((post) => (
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
      <h1>uh Oh..</h1>
      <p>something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
