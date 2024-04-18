import { type LoaderFunctionArgs, json } from '@remix-run/node'
import {
    NavLink,
    Outlet,
    useFetcher,
    useLoaderData,
    useLocation
} from '@remix-run/react'
import React from 'react'
import PostPreviewCard from '~/components/post-preview-card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'

import { compile } from '@mdx-js/mdx'
import { getFile } from '~/.server/markdown.server'
import { marked } from 'marked'
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
    console.log(posts, 'posts')
    const pUrl = new URL('/app/content/blog/database.mdx', import.meta.url)
    console.log(pUrl, 'pUrl')

    if (!posts) throw new Error('No posts found')
    const keys = Object.keys(posts)

    // const relativePath = '/app/content/blog/database.mdx'
    // const isdir = await isDirectory(relativePath)
    // console.log(isdir, 'isdir');
    // const islocal = await isFile(relativePath)
    // console.log(islocal, 'islocal');
    // const apost =  nodepath.resolve(process.cwd())
    // console.log(apost, 'apost');
    // const content = fs.readFileSync(pUrl.href, { encoding: 'utf-8' })

    const slugs = keys.map((key) => key.replace('./', '').replace('.mdx', ''))
    const oneSlug = slugs[0]
    console.log(oneSlug, 'oneSlug')

    const { frontmatter, content } = await getFile(slugs[3])
    console.log(frontmatter, 'frontmatter')

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
    const compiled = await compile(content)
    console.log(compiled, 'compiled')

    return json({ slugs, postsData, categories, content, compiled })
}

export default function BlogRoute() {
    const [item, setItem] = React.useState('item-1')
    console.log(item, 'item')

    const [value, setValue] = React.useState('item-1')

    const { postsData, slugs, categories, content, compiled } =
        useLoaderData<typeof loader>()

    const handleNavigationAndOpenOrClose = React.useCallback(() => {
        setItem('item-1')
    }, [item])

    return (
        <div className='flex flex-col gap-2 items-center w-full mx-auto mt-4'>
            <div
                className='flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
                dangerouslySetInnerHTML={{ __html: compiled }}
            />
            <div className='flex flex-col gap-2 items-center w-full mx-auto mt-4'>
                <div
                    className='flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'
                    dangerouslySetInnerHTML={{ __html: marked(content) }}
                />

                <div className='flex flex-row gap-2'>
                    <NavLink to='/blog+'>Posts</NavLink>
                    <NavLink to='/blog+/new'>New Post</NavLink>
                </div>
            </div>

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

            <div className='prosse max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
                <Outlet />
            </div>
        </div>
    )
}
