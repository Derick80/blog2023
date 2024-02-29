import { EditorContent, useEditor } from '@tiptap/react'
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";

import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Underline from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Typography from '@tiptap/extension-typography'
import Heading from '@tiptap/extension-heading'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import BulletList from '@tiptap/extension-bullet-list'
import Paragraph from '@tiptap/extension-paragraph'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import History from '@tiptap/extension-history'
import CodeBlock from '@tiptap/extension-code-block'
import { ResizableImage } from './tiptap-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import ToolBar from '../blog-ui/post/toolbar'
import { Muted } from '../ui/typography'
import {type  INTENTS } from '../blog-ui/types';


const CustomSubscript = SubScript.extend({
  excludes: 'superscript'
})

const CustomSuperscript = Superscript.extend({
  excludes: 'subscript'
})

const Editor = ({ content, setContent,postId }: {
  content?: string,
  setContent: (content: string) => void,
  postId: string,

}) => {

  const limit = 10000
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Strike,
      Code,
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'tip-tap-image'
        }
      }),
      Dropcursor.configure({
        color: '#ff0000'
      }),
      Heading.configure({
        levels: [1, 2, 3]
      }),
      CustomSuperscript,
      CustomSubscript,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'p-2 rounded-md mt-2 min-h-[500px]'
        }
      }),
      Underline,
      Highlight,
      BulletList,
      OrderedList,
      ListItem,
      Paragraph,
      History,
      Link,
      TextStyle,

      CharacterCount.configure({
        limit
      }),
      Typography
    ],
      content,
    // use a debounce fetcher to submit the content to the server and prevent too many requests
    onUpdate ({ editor }) {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] p-2 rounded-md mt-2 shadow-foreground bg-background',
        spellcheck: 'true'
      }
    }
  })
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-col gap-2 rounded-md bg-background shadow-[0_2px_10px] shadow-blackA4'>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
      <input type='hidden' name='content' value={editor?.getHTML()} />
      <div className='flex items-center justify-end gap-1 text-xs'>
        <Muted>
          {editor.storage.characterCount.characters()}/{limit} characters
        </Muted>
        <Muted>{editor.storage.characterCount.words()} words</Muted>
      </div>
    </div>
  )
}

export default Editor
