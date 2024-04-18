import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { MDXProvider } from '@mdx-js/react'
import { useLoaderData } from '@remix-run/react'
import { frontmatterType } from './writing'
type PostModule = { [key: string]: unknown } // Unknown structure for now

export async function loader({ request, params }: LoaderFunctionArgs) {
    const slug = params.slug
    if (!slug) throw new Error('No slug found')
    const posts = import.meta.glob(`..//content/blog/*.mdx`)

    if (!posts) throw new Error('No post found')
    console.log(Array.isArray(posts), 'posts')

    console.log(posts, 'post')

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

    const post = postData.find((post) => post.slug === slug)
    if (!post) throw new Error('No post found')
    console.log(post, 'post')
    // need to parse the mdx file here

    const mdxFile = await post.code()
    console.log(mdxFile, 'mdxFile')

    const Component = String(
        await compile(post.code, { outputFormat: 'function-body' })
    )
    console.log(Component, 'Component')

    return json({ post, Component, postData, slugs })
}

export default function SlugRoute() {
    const { post, Component } = useLoaderData<typeof loader>()

    return (
        <div className='border-2'>
            <h1>Writing</h1>
            <MDXProvider>
                <Component {...remarkFrontmatter} />
            </MDXProvider>
            huhg
        </div>
    )
}
