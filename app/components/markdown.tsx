// /lib/markdown.js

import { useMemo } from 'react'
import { useMDXComponents } from '@mdx-js/react'
import { compile } from '@mdx-js/mdx'
import { run } from '@mdx-js/mdx'

import remarkGfm from 'remark-gfm'
import { Compatible } from 'vfile'

export function compileMDXFunction(mdx: Compatible) {
    return compile(mdx, {
        format: 'mdx',
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm]
    }).then((buf) => buf.toString())
}

export function useMDXFunction(code: unknown) {
    return useMemo(() => {
        return compileMDXFunction(code).then((code) => {
            const scope = { mdx: run }
            const keys = Object.keys(scope)
            const values = Object.values(scope)
            const fn = new Function(
                'React',
                ...keys,
                `${code}\nreturn MDXContent`
            )
            return (React: any, ...values: any) => {
                const element = fn(React, ...values)
                return element
            }
        })
    }, [code])
}
