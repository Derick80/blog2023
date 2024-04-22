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
