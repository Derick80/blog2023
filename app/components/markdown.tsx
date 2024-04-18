import { type RenderableTreeNodes } from '@markdoc/markdoc'
import pkg from '@markdoc/markdoc'
const { renderers } = pkg
import * as React from 'react'

type Props = { content: RenderableTreeNodes }

export function Markdown({ content }: Props) {
    return <>{renderers.react(content, React)}</>
}
