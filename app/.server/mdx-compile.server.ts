import * as fsp from 'node:fs/promises'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import remarkSlug from 'remark-slug'
import remarkAutolinkHeader from 'remark-autolink-headings/index'
import rehypePrettyCode from 'rehype-pretty-code'
import { bundleMDX } from 'mdx-bundler'
import { frontmatterType } from '~/routes/writing'
export type PostFrontMatter = {
    code: string
    slug: string
    title: string
    author: string
    description: string
    datePublished: string
    published: boolean
    categories: string[]
}

// I am using this in my prebuild script to get all the content from the blog folder and update the database
// I want to create a github action that will run this script and update the database with the content from the blog folder
export const getAllPostContent = async() => {
    const postsDirectory = path.join(process.cwd(), '/app/content/blog/')
    const fileNames = fs.readdirSync(postsDirectory)

    if (!fileNames.length) throw new Error('No posts found')

    const posts = fileNames.map((fileName) => {
        const filePath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(filePath, 'utf8')

        // @ts-ignore
        const { data } = matter<PostFrontMatter>(fileContents)

        // add slug to data object
        data.slug = fileName.replace('.mdx', '')


        // return datePublished as a string AND REMOVE  everything after and including the 'T'

        return data
    })

    // console.log(posts, 'data from getAllPostContent');

    return posts
}


// Best way so farf to get an Mdx fiel
export async function getMDXFileContent(slug: string) {
    const basePath = `${process.cwd()}/app/content/blog/`
    const source = await fsp.readFile(
        path.join(`${basePath}/${slug}.mdx`),
        'utf-8'
    )
    // bundle the mdx file

    const data = await bundleMDX<PostFrontMatter>({
        source,

        cwd: `${process.cwd()}/app/content/blog`,
        mdxOptions: (options) => ({
            remarkPlugins: [
                ...(options.remarkPlugins ?? []),
                remarkSlug,
                [remarkAutolinkHeader, { behavior: 'wrap' }],
                remarkGfm
            ],
            rehypePlugins: [
                ...(options.rehypePlugins ?? []),
                [rehypePrettyCode, options = {
                    grid: false,

                }],
                rehypeHighlight
            ]
        }),

        grayMatterOptions: (options) => {
      options.excerpt = true

            return {
                ...options,
                        providerImportSource: '@mdx-js/react',

    }
     }
    })

    return data
}



// kcd types for later
// const re = /\b([-\w]+(?![^{]*}))(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g
// export const MdxSchema = z.object({
//   code: z.string().optional(),
//   frontmatter: z.object({
//     slug: z.string(),
//     title: z.string(),
//     description: z.string().optional().nullable().default(null),
//     tags: z.string().optional().nullable(),
//     img: z.string().optional().nullable().default(null),
//     timestamp: z.string().optional().nullable().default(null),
//     published: z.boolean().optional().default(false),
//     translations: z
//       .array(
//         z.object({
//           lang: z.string(),
//           href: z.string(),
//           label: z.string(),
//         }),
//       )
//       .optional(),
//   }),
// })
