import pkg from '@markdoc/markdoc'
const { parse, transform } = pkg
import { RenderableTreeNodes } from '@markdoc/markdoc/dist/'
export { bundleMDX } from 'mdx-bundler'

function markdown(markdown: string): RenderableTreeNodes {
    return transform(parse(markdown))
}

export { markdown }
