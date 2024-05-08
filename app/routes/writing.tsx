import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet, Scripts, useLoaderData } from '@remix-run/react'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'
import PostPreviewCard from '~/components/post-preview-card'
import { useNonce } from '~/lib/nonce-provider'
import { getAllPostContent } from '~/.server/mdx-compile.server'

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

export async function loader({ request, params }: LoaderFunctionArgs) {
    const posts = getAllPostContent()
    if (!posts) throw new Error('No posts found')


    return json({ posts })
}

export default function WritingRoute() {
    const { posts } = useLoaderData<typeof loader>()
    const [item, setItem] = React.useState('item-1')

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
                        {posts
                            ? posts.map(
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

export function ErrorBoundary() {
    // the nonce doesn't rely on the loader so we can access that
    const nonce = useNonce()

    // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
    // likely failed to run so we have to do the best we can.
    // We could probably do better than this (it's possible the loader did run).
    // This would require a change in Remix.

    // Just make sure your root route never errors out and you'll always be able
    // to give the user a better UX.

    return (
        <div className='text-red-500'>
            <h1>Something went wrong At the Writing Route</h1>
            <p>Sorry about that. Please try again.</p>
            <Scripts nonce={nonce} />
        </div>
    )
}
