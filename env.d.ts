/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module '*.mdx' {
    let MDXComponent: (props: any) => JSX.Element
    export type frontmatter = {
        title: string
        author: string
        description: string
        datePublished: string
        published: boolean
        categories: string[]
    }
    export default MDXComponent
}
// types/gray-matter.d.ts
declare module 'gray-matter' {
    interface GrayMatterFile<T = Record<string, any>> {
        content: string
        data: T
        isEmpty?: boolean
        excerpt?: string
        orig: string | Buffer
    }

    function matter<T = Record<string, any>>(
        input: string | Buffer,
        options?: any
    ): GrayMatterFile<T>

    export = matter
}
