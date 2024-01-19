import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import {
  CodeIcon,
  DividerHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ImageIcon,
  Link1Icon,
  LinkBreak1Icon,
  ListBulletIcon,
  Pencil1Icon,
  StrikethroughIcon,
  UnderlineIcon
} from '@radix-ui/react-icons'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Underline from '@tiptap/extension-underline'
import { Highlight } from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import React from 'react'
import TextStyle from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
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
import SubscriptIcon from './icons/subscript'
import SuperScriptIcon from './icons/superscript'
import { ResizableImage } from './tiptap-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { Button } from '~/components/ui/button'

// implimeent redo/undo and blockquote
const MenuBar = ({ editor }: { editor: Editor }) => {
  const addImage = React.useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: `A image replacement for ${url}` })
        .run()
    }
  }, [editor])
  const setLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div
      className='flex p-2 w-full min-w-max rounded-md border-2'
      aria-label='Editor toolbar'
    >
      <div className='flex flex-row  items-center gap-1'>
        <Button
          type='button'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FontBoldIcon />
        </Button>

        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FontItalicIcon />
        </Button>

        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </Button>

        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </Button>

        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperScriptIcon />
        </Button>

        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon />
        </Button>
      </div>
      <div className='' />
      <div className='flex flex-row items-center gap-1'>
        <Button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive('heading', { level: 1 })
              ? 'is-active flex items-center'
              : 'flex items-center'
          }
        >
          <HeadingIcon />
          <p className='text-[15px]'>1</p>
        </Button>
        <Button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 })
              ? 'is-active flex items-center font-bold outline-dashed'
              : 'flex items-center'
          }
        >
          <p className='text-[15px]'>H2</p>
        </Button>
        <Button
          type='button'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive('heading', { level: 3 })
              ? 'is-active flex items-center'
              : 'flex items-center'
          }
        >
          <HeadingIcon />
          <p className='text-[15px]'>3</p>
        </Button>
      </div>

      <div className='flex flex-row items-center gap-1'>
        <Button
          type='button'
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBulletIcon />
        </Button>
        <Button
          type='button'
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListBulletIcon />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Pencil1Icon />
        </Button>
      </div>
      <div className='flex flex-row items-center gap-1'>
        <Button
          type='button'
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <DividerHorizontalIcon />
        </Button>
        <Button
          type='button'
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
        >
          <Link1Icon />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <LinkBreak1Icon />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          <CodeIcon />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          <CodeIcon />
        </Button>
        <Button
          className={editor.isActive('image') ? 'is-active' : ''}
          type='button'
          onClick={addImage}
        >
          <ImageIcon />
        </Button>
      </div>
    </div>
  )
}

const CustomSubscript = SubScript.extend({
  excludes: 'superscript'
})

const CustomSuperscript = Superscript.extend({
  excludes: 'subscript'
})

const TipTap = ({ content }: { content?: string }) => {
  const limit = 10000
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Bold,
      Italic,
      Strike,
      Code,
      HorizontalRule,
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
      Image,
      Typography
    ],
    content: content,

    editorProps: {
      attributes: {
        class:
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        spellcheck: 'true'
      }
    }
  })
  //       class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
  // -4 mx-auto border border-t-0 prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full  text-sm focus:outline-non rounded-b-md mt-0
  if (!editor) {
    return null
  }

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <input type='hidden' name='content' value={editor?.getHTML()} />
      <div className='flex items-center justify-end gap-1 text-xs'>
        <p className='text-gray-500'>
          {editor.storage.characterCount.characters()}/{limit} characters
        </p>
        <p className='text-gray-500'>
          {editor.storage.characterCount.words()} words
        </p>
      </div>
    </>
  )
}

export default TipTap
