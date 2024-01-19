import type { MetaFunction } from '@remix-run/react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import {
  filterPosts,
  useCategories,
  useUpdateQueryStringValueWithoutNavigation
} from '~/utilities'

import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getAllPostsV1 } from '~/server/post.server'

import ContactWidget from '~/components/contact-widget'
import ScrollingBanner from '~/components/scroll-banner_v2'
import React from 'react'
import CustomCheckbox from '~/components/custom-checkbox_v2'
import { Separator } from '~/components/ui/separator'
export const meta: MetaFunction = () => {
  return [
    { title: `Derick C Hoskinson's Blog` },
    {
      name: 'description',
      content: 'A social media style blog and project showcase'
    }
  ]
}

export async function loader ({ request }: LoaderFunctionArgs) {
  const posts = await getAllPostsV1(5)
  if (!posts) throw new Error('No posts found')

  return json({ posts })
}

export default function Index () {
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
    <div className='md:gap-38 flex w-full items-center flex-col gap-28'>
      <div className='flex w-full flex-col items-center gap-10 md:gap-20'>
        {/* probably remove dive around the headings if I don't change the font */ }
        <div className='flex flex-col w-full items-center gap-20 '>
          <h1>Welcome to DerickCHoskinson.com </h1>
          <ScrollingBanner />
          <h3>
            <b>Showcasing</b> my projects as a novice web developer, my blog
            about web development and genetics, and my curriculum vitae as a
            Geneticist
          </h3>
        </div>
        <div className='flex w-full flex-col gap-2'>
          <Separator orientation='horizontal' />
          <div className='mb-4 flex w-full flex-row items-center gap-2'>
            <h6 className='text-left'>
              Filter the 5 most Recent Blog Posts by
            </h6>

            <h1>Category</h1>
          </div>
          <div className='col-span-full -mb-4 -mr-4 flex flex-wrap lg:col-span-10'>
            { categories
              ? categories.map((category) => {
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
              })
              : null }
          </div>
        </div>
      </div>

      <div className='flex w-full flex-col gap-2'>
        <Separator />{ ' ' }
        <div className='mb-4 flex w-full flex-row items-center gap-2'>
          <h6 className='text-left'>Get started with the</h6>
          <h1>Latest Posts</h1>
        </div>
        <div className='flex w-full flex-col items-center gap-5'>
          {/* {matchingPosts.map((post) => (
            <BlogPreviewV2 key={post.id} post={post} />
          ))} */}
        </div>
        <div className='flex w-full flex-col gap-2'>
          <Separator />{ ' ' }
          <div className='mb-4 flex w-full flex-row items-center gap-2'>
            <h6 className='text-left'>Want to </h6>
            <h1>Connect with me?</h1>
          </div>
        </div>
        <ContactWidget />
      </div>
    </div>
  )
}
