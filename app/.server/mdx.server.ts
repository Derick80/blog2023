import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { bundleMDX } from './bundler.server'
import nodepath from 'path'
import rehypePrettyCode from 'rehype-pretty-code'

type MDXBUndleProps = {
    mdx: string
    files?: Record<string, string>
}
export const bundleSomeMDX = async ({ mdx, files }: MDXBUndleProps) => {
    const relativePath = 'app/content/blog/'
    const contentPath = nodepath.resolve(
        process.cwd(),
        relativePath,
        mdx + '.mdx'
    )
    if (files) {
        const result = await bundleMDX({
            source: contentPath,
            files,
            mdxOptions(options, frontmatter) {
                // this is the recommended way to add custom remark/rehype plugins:
                // The syntax might look weird, but it protects you in case we add/remove
                // plugins in the future.
                options.remarkPlugins = [
                    ...(options.remarkPlugins ?? []),
                    remarkMdxFrontmatter
                ]
                options.rehypePlugins = [
                    ...(options.rehypePlugins ?? []),
                    rehypePrettyCode
                ]

                return options
            }
        })
        return result
    } else {
        const result = await bundleMDX({
            source: mdx
        })
        return { code: result.code, frontmatter: result.frontmatter }
    }
}
