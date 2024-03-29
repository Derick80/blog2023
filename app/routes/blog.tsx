import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
  useSearchParams
} from '@remix-run/react'
import { createMinimalPost, getPosts } from '~/server/post.server'

import {
  filterPosts,
  useCategories,
  useOptionalUser,
  useUpdateQueryStringValueWithoutNavigation,
  validateAction
} from '~/utilities'
import React from 'react'
import CustomCheckbox from '~/components/custom-checkbox_v2'
import { Separator } from '~/components/ui/separator'
import { H2, H3, Large, Muted } from '~/components/ui/typography'
import BlogPreviewCard from '~/components/blog-ui/post/blog-preview-card'
import {
  getUserAndAdminStatus,
  isAuthenticated
} from '~/server/auth/auth.server'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { z } from 'zod'
import { Category, Post } from '~/server/schemas/schemas'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick's Blog`
    }
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, isAdmin } = await getUserAndAdminStatus(request)

  const posts = await getPosts()
  if (!posts) throw new Error('No posts found')

  return json({ posts, isAdmin, user })
}

const schema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('create'),
    title: z.string().nonempty('Title is required')
  })
])

type ActionInput = z.infer<typeof schema>
export async function action({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) throw new Error('Unauthorized')

  const { formData, errors } = await validateAction({
    request,
    schema
  })
  if (errors) {
    return json({ errors }, { status: 400 })
  }

  const { intent, title } = formData as ActionInput

  if (intent === 'create') {
    const post = await createMinimalPost({ userId: user.id, title })
    if (!post) throw new Error('Post not created')
    return redirect(`/blog/drafts/${post.id}`)
  }
}
export default function BlogRoute() {
  const user = useOptionalUser()
  console.log(user, 'user in blog rouee from useOptionalUser')

  const { posts, isAdmin } = useLoaderData<typeof loader>()
  const categories = useCategories()

  const [searchParams] = useSearchParams()

  const [queryValue, setQuery] = React.useState<string>(() => {
    return searchParams.get('q') ?? ''
  })
  const query = queryValue.trim()

  useUpdateQueryStringValueWithoutNavigation('q', query)

  const matchingPosts = React.useMemo(() => {
    if (!query) return posts

    let filteredPosts: Omit<Post, 'comments'>[] = posts
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
      <div className='flex flex-col items-center gap-10 md:gap-20'>
        <H2>Welcome to the Blog for DerickCHoskinson.com </H2>
        {isAdmin && <BlogAdminMenu />}
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
        </div>
        <div className='hidden md:flex col-span-full -mb-4 -mr-4  flex-wrap lg:col-span-10'>
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
        <MobileAccordianCategoryContainer
          categories={categories}
          toggleTag={toggleTag}
          visibleTags={visibleTags}
          query={query}
        />
      </div>
      <div className='flex w-full flex-col items-start gap-2'>
        <Outlet />
        {!queryValue ? (
          <div className='flex flex-row items-center gap-2 mb-5'>
            <H3 className='text-left'>Viewing all the </H3>
            <Large>Blog Posts</Large>
          </div>
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

      <div className='flex flex-col md:flex-row md:flex-wrap w-full gap-6'>
        {matchingPosts?.map((post) => (
          <BlogPreviewCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

const BlogAdminMenu = () => {
  return (
    <div className='flex flex-col gap-4'>
      <H3>Admin Menu</H3>
      <Link to='/blog/drafts'>Go to Drafts</Link>

      <H3>Create a new Post</H3>
      <Form method='post'>
        <Input
          type='text'
          name='title'
          placeholder='enter a title to get started'
        />
        <Button type='submit' name='intent' value='create'>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export const ErrorBoundary = () => {
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

type MobileAccordianCategoryContainerProps = {
  categories: Category[]
  toggleTag: (tag: string) => void
  visibleTags: Set<string>
  query: string
}

function MobileAccordianCategoryContainer({
  categories,
  toggleTag,
  visibleTags,
  query
}: MobileAccordianCategoryContainerProps) {
  return (
    <Accordion type='single' collapsible className='block lg:hidden w-full'>
      <AccordionItem className='border-none' value='categories'>
        <AccordionTrigger>
          <h1>Categories</h1>
        </AccordionTrigger>
        <AccordionContent>
          <div className='col-span-full -mb-4 -mr-4 flex flex-wrap lg:col-span-10'>
            {categories
              ? categories.map((category) => {
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
                })
              : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
