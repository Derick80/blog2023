import { Node } from '@tiptap/react'

export default class TemplateExtension extends Node {

  get name() {
    return 'template'
  }

  get schema() {
    return {
      attrs: {
        name: {
          default: '',
        },
      },
      group: 'block',
      content: 'block*',
      marks: '',
      defining: true,
      parseDOM: [
        {
          tag: 'template',
          getAttrs: (dom: { getAttribute: (arg0: string) => any }) => ({ name: dom.getAttribute('name') }),
        },
      ],
      toDOM: (node: { attrs: { name: any } }) => ['template', { name: node.attrs.name }, 0],
    }
  }

commands({ type }: { type: any }) {
    return (attrs: any) => (state: any, dispatch: any) => {
        const { name } = attrs
        dispatch(state.tr.replaceSelectionWith(type.create({ name })))
    }


}
}
