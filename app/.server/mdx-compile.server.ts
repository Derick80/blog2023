import pkg from '@markdoc/markdoc'
const { parse, transform } = pkg
import { RenderableTreeNodes } from '@markdoc/markdoc/dist/'
import * as fsp from 'node:fs/promises';
import fs from 'fs'
import nodepath from 'path'
import path from 'path'
import { bundleMDX } from './bundler.server';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight'
import remarkSlug from 'remark-slug'


export type PostFrontMatter = {
    code: string
    slug: string
    title: string
    author: string
    description: string
    datePublished: string
    published: boolean
    tags: string[]

}

export const contentPath = path.join(process.cwd(), '/app/content/')

export const getFile = async (slug: string) => {
    const relativePath = 'app/content/blog/'
    const contentPath = nodepath.resolve(
        process.cwd(),
        relativePath,
        slug + '.mdx'
    )

    const content = fs.readFileSync(contentPath, { encoding: 'utf-8' })
    // return the frontmatter and the content
    const frontmatter = content.split('---')[1]
    const content1 = content.split('---')[2]

    return { frontmatter, content: content1 }
}



//     const postsPath = await fsp.readdir(contentPath, {
//         withFileTypes: true,
//     })

//     console.log(postsPath, 'postsPath');


//     // loop through the postsPath array and retreive the frontmatter for each post
//     const posts = (
//         await Promise.all(
//             postsPath.map(async (post) => {
//                 const source = await fsp.readFile(path.join(contentPath, post.name),
//                     'utf-8'
//                 )
//                 console.log(source, 'source');

//                 const { code, frontmatter } = await bundleMDX<PostFrontMatter>({
//                     source: source.toString(),
//                     cwd: process.cwd(),
//                     mdxOptions: options => ({
//         remarkPlugins: [
//           ...(options.remarkPlugins ?? []),
//           remarkSlug,
//           [rehypeAutolinkHeadings, { behavior: 'wrap' }],
//           remarkGfm,
//         ],
//         rehypePlugins: [...(options.rehypePlugins ?? []), rehypeHighlight],
//       }),
//                 })
//                 console.log(Array.isArray(frontmatter.tags), 'frontmatter.tags');

//                 return {
//                     code,
//                     slug: post.name.replace(/\.mdx/, ''),
//                     title: frontmatter.title,
//                     author: frontmatter.author,
//                     description: frontmatter.description,
//                     date: frontmatter.datePublished,
//                     tags: frontmatter.tags,
//                     published: frontmatter.published,
//                 }
//             })
//         )
//     ).filter((post) => post.published === true)

// return posts

