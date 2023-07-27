import { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  CodeIcon,
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ImageIcon,
  Link1Icon,
  LinkBreak1Icon,
  ListBulletIcon,
  Pencil1Icon,
  PersonIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon
} from '@radix-ui/react-icons'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Underline from '@tiptap/extension-underline'
import highlight from '@tiptap/extension-highlight'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import React from 'react'
import TextStyle from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'

import Typography from '@tiptap/extension-typography'
import Heading from '@tiptap/extension-heading'

const MenuBar = ({ editor }: { editor: Editor }) => {
  const addImage = React.useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
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
    <div className='flex- flex w-full  flex-row items-center justify-between rounded-t-md border-b-2 border-gray-200 p-1 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white'>
      <div className='flex flex-row items-center gap-1'>
        <button
          type='button'
          className={editor.isActive('bold') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FontBoldIcon />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FontItalicIcon />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </button>
        <button
          type='button'
          className='flex flex-row items-center gap-1'
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <TextIcon />
          <DoubleArrowUpIcon />
        </button>
        <button
          type='button'
          className='flex flex-row items-center gap-1'
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <TextIcon />
          <DoubleArrowDownIcon />
        </button>
      </div>
      <div className='flex flex-row items-center gap-1'></div>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Pencil1Icon />
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <HeadingIcon />
        <p className='text-[15px]'>1</p>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <HeadingIcon />
        <p className='text-[15px]'>1</p>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <HeadingIcon />
        <p className='text-[15px]'>1</p>
      </button>
      <button
        type='button'
        onClick={setLink}
        className={editor.isActive('link') ? 'is-active' : ''}
      >
        <Link1Icon />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <LinkBreak1Icon />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <CodeIcon />
      </button>
      <button
        className={editor.isActive('image') ? 'is-active' : ''}
        type='button'
        onClick={addImage}
      >
        <ImageIcon />
      </button>
      <button
        type='button'
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletIcon />
      </button>

      <button
        type='button'
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListBulletIcon />
      </button>
    </div>
  )
}

const TipTap = ({ content }: { content?: string }) => {
  const limit = 10000
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Heading,
      Superscript,
      SubScript,
      Underline,
      highlight,
      Code,
      Link,
      TextStyle,
      BulletList.configure({
        keepAttributes: true
      }),
      OrderedList,
      ListItem,

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
          'flex-1 p-4 mx-auto border border-t-0 text-black dark:text-slate-50 w-full h-fit text-sm m-5 focus:outline-non rounded-b-md mt-0 '
      }
    }
  })

  const schema = editor?.schema

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
