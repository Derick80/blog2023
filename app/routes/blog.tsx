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
import { getPosts } from '~/server/post.server'

import {
  filterPosts,
  useCategories,
  useOptionalUser,
  useUpdateQueryStringValueWithoutNavigation
} from '~/utilities'
import React from 'react'
import CustomCheckbox from '~/components/custom-checkbox_v2'
import { Separator } from '~/components/ui/separator'
import { H2, H3, Large, Muted } from '~/components/ui/typography'
import BlogPreviewCard from '~/components/blog-ui/post/blog-preview-card'

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader ({ request }: LoaderFunctionArgs) {

  const posts = await getPosts()
  // isolate all comments from posts and flatten them into one array for use with useMatchesData


  return json({ posts })
}

export default function BlogRoute () {
  const user = useOptionalUser()
  const isAdmin = user?.role === 'ADMIN'
  const { posts } = useLoaderData<typeof loader>()
  const categories = useCategories()

  const [searchParams] = useSearchParams()

  const [queryValue, setQuery] = React.useState<string>(() => {
    return searchParams.get('q') ?? ''
  })
  const query = queryValue.trim()

  useUpdateQueryStringValueWithoutNavigation('q', query)

  const matchingPosts = React.useMemo(() => {
    if (!query) return posts

    let filteredPosts = posts
    return filterPosts(filteredPosts, query)
  }, [query, posts])

  const isSearching = query.length > 0

  const visibleTags = isSearching
    ? new Set(
      matchingPosts.flatMap((post) =>
        post.categories.map((p) => p.value).filter(Boolean)
      )
    )
    : new Set(categories.map((p) => p.value))

  function toggleTag (tag: string) {
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
      <div className='flex flex-col items-center gap-10 md:gap-20'>
        <H2>Welcome to the Blog for DerickCHoskinson.com </H2>
        <H3>
          <b>Writings</b> about my projects as a novice web developer but mostly
          fake posts used to test the blog
        </H3>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <Separator orientation='horizontal' />
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <Muted className='text-left'>You can browse the Blog by </Muted>
          <Large>Category</Large>
        </div>{ ' ' }
        <div className='col-span-full -mb-4 -mr-4 flex flex-wrap lg:col-span-10'>
          { categories.map((category) => {
            const selected = query.includes(category.value)
            return (
              <CustomCheckbox
                key={ category.id }
                name='category'
                tag={ category.value }
                selected={ selected }
                onClick={ () => toggleTag(category.value) }
                disabled={ !visibleTags.has(category.value) }
              />
            )
          }) }
        </div>
      </div>
      <div className='flex w-full flex-col items-center gap-2'>
        <Outlet />
        <Separator orientation='horizontal' />
        { !queryValue ? (
          <>
            <h6 className='text-left'>Viewing all the </h6>
            <h1>Blog Posts</h1>
          </>
        ) : (
          <div className='flex flex-row items-center gap-2 flex-wrap'>
            <h6 className='text-left'>
              Viewing Blog Posts with the category(ies)
            </h6>
            { queryValue.split(' ').map((tag) => (
              <h1 key={ tag } className='text-primary'>
                { tag }
              </h1>
            )) }
          </div>
        ) }
      </div>

      <div

        className='flex flex-col md:flex-row md:flex-wrap gap-2'
      >
        { matchingPosts?.map((post) => (
          <BlogPreviewCard key={ post.id } post={ post } />
        )) }
      </div>
    </div>
  )
}

export function ErrorBoundary () {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops blog Error boundry</h1>
        <h1>Status:{ error.status }</h1>
        <p>{ error.data.message }</p>
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
      <pre>{ errorMessage }</pre>
    </div>
  )
}
