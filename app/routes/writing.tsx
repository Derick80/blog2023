import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import APost from '../content/blog/genetics.mdx'
import React from 'react'
import { compileMDXFunction } from '~/components/markdown'

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
    // const compiled = await compile(await fs.readFile('../content/blog/genetics.mdx', 'utf8'))

    // console.log(String(compiled))
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

    const onePost = postsData[0]

    if (!postsData || postsData === null) throw new Error('No posts data found')
    return json({ postsData, postData, categories, slugs })
}

export default function WritingRoute() {
    const { postsData, postData, slugs, categories } =
        useLoaderData<typeof loader>()

    // get the first object in the array
    const post = postsData[0]

    return (
        <div className='flex flex-col items-center justify-around w-full h-full p-2 gap-4'>
            <h1>Writing</h1>
            <Outlet />
            <div className='flex flex-col gap-2 w-full'>
                {postData.map(
                    (post) =>
                        post && (
                            <div
                                className='border-2 flex flex-col gap-2 w-full p-2'
                                key={post.slug}
                            >
                                <NavLink
                                    className={
                                        'text-blue-500 hover:text-blue-700'
                                    }
                                    to={`/writing/${post.slug}`}
                                >
                                    <h2>{post.title}</h2>
                                </NavLink>
                                <p>{post.description}</p>
                                <p>{post.datePublished}</p>
                                <p>{post.author}</p>
                                <ul className='flex gap-2 flex-row flex-wrap w-full '>
                                    {post.categories.map((category) => {
                                        return (
                                            <li key={category}>
                                                <Badge>{category}</Badge>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                )}
            </div>
        </div>
    )
}
