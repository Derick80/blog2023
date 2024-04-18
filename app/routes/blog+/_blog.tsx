import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData, useLocation } from '@remix-run/react'
import React from 'react'
import PostPreviewCard from '~/components/post-preview-card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'
import { H3 } from '~/components/ui/typography'

export type frontmatterType = {
    title: string
    author: string
    description: string
    datePublished: string
    published: boolean
    slug: string
    url: string
    categories: string[]
}
type PostModule = { [key: string]: unknown } // Unknown structure for now

export async function loader({ request, params }: LoaderFunctionArgs) {
    const posts = import.meta.glob('./*.mdx')

    if (!posts) throw new Error('No posts found')
    const keys = Object.keys(posts)

    const slugs = keys.map((key) => key.replace('./', '').replace('.mdx', ''))

    const postData = await Promise.all(
        keys.map(async (key) => {
            const { frontmatter } = (await posts[key]()) as PostModule
            if (frontmatter && typeof frontmatter === 'object') {
                // Only process if frontmatter exists and is an object
                return {
                    ...frontmatter,
                    url: key,
                    slug: key.replace('./', '').replace('.mdx', '')
                } as frontmatterType
            } else {
                // Handle the case where frontmatter is missing or not an object
                console.error(
                    `Error processing post: ${key}. Missing or invalid frontmatter.`
                )
                return null // Or some placeholder value if needed
            }
        })
    )

    const postsData = postData.filter(
        (post) => post !== null && post.published === true
    )
    const categories = postsData.map((post) => (post ? post.categories : null))

    if (!postsData || postsData === null) throw new Error('No posts data found')
    return json({ keys, postsData, categories })
}

export default function BlogRoute() {
    const [item, setItem] = React.useState('item-1')

    const [value, setValue] = React.useState('item-1')

    const { postsData, keys, categories } = useLoaderData<typeof loader>()

    return (
        <div className='flex flex-col gap-2 items-center w-full mx-auto mt-4'>
            <Accordion
                className='w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
                value={value}
                onValueChange={setValue}
                type='single'
                collapsible
            >
                <AccordionItem value={item}>
                    <AccordionTrigger onClick={() => setItem('item-1')}>
                        <H3 className='text-2xl font-bold'>Posts</H3>
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-2'>
                        {postsData
                            ? postsData.map(
                                  (post) =>
                                      post && (
                                          <PostPreviewCard
                                              setItem={setValue}
                                              key={post.slug}
                                              title={post.title}
                                              author={post.author}
                                              description={post.description}
                                              datePublished={post.datePublished}
                                              published={post.published}
                                              categories={post.categories}
                                              slug={post.slug}
                                          />
                                      )
                              )
                            : null}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className='prose max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
                <Outlet />
            </div>
        </div>
    )
}
