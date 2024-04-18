import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import React from 'react'
import { bundleSomeMDX } from '~/.server/mdx.server'
import { Badge } from '~/components/ui/badge'
import { getMDXComponent } from 'mdx-bundler/client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'
import { item } from '@markdoc/markdoc/dist/src/schema'
import PostPreviewCard from '~/components/post-preview-card'

export type frontmatterType = {
    title: string
    author: string
    description: string
    datePublished: string
    published: boolean
    slug: string
    url: string
    categories: string[]
    code: () => Promise<{ default: React.ComponentType }>
}
type PostModule = { [key: string]: unknown } // Unknown structure for now
export async function loader({ request, params }: LoaderFunctionArgs) {
    const posts = import.meta.glob('../content/blog/*.mdx')

    if (!posts) throw new Error('No posts found')
    const keys = Object.keys(posts)

    const slugs = keys.map((key) =>
        key.replace('../content/blog/', '').replace('.mdx', '')
    )

    const postData = await Promise.all(
        keys.map(async (key) => {
            const { frontmatter } = (await posts[key]()) as PostModule
            if (frontmatter && typeof frontmatter === 'object') {
                // Only process if frontmatter exists and is an object
                return {
                    ...frontmatter,
                    url: key,
                    slug: key
                        .replace('../content/blog/', '')
                        .replace('.mdx', ''),
                    code: () =>
                        import(
                            `../content/blog/${key.replace('../content/blog/', '').replace('.mdx', '')}.mdx`
                        )
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
    return json({ postData, categories, slugs })
}

export default function WritingRoute() {
    const { postData, slugs, categories } = useLoaderData<typeof loader>()
    const [item, setItem] = React.useState('item-1')
    console.log(item, 'item')

    const [value, setValue] = React.useState('item-1')
    return (
        <div className='flex flex-col items-center justify-around w-full h-full p-2 gap-4'>
            <h1>Writing</h1>
            <Outlet />
            <Accordion
                className='w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
                value={value}
                onValueChange={setValue}
                type='single'
                collapsible
            >
                <AccordionItem value={item}>
                    <AccordionTrigger onClick={() => setItem('item-1')}>
                        <h2 className='text-2xl font-bold'>Posts</h2>
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-2'>
                        {postData
                            ? postData.map(
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
        </div>
    )
}
