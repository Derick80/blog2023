import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
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
  StrikethroughIcon,
  TextIcon,
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
import * as Toolbar from '@radix-ui/react-toolbar'
import { MyTooltip } from '../../radix-tooltip'
import SubscriptIcon from './icons/subscript'
import SuperScriptIcon from './icons/superscript'
import { ResizableImage } from './tiptap-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

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
    <Toolbar.Root
      className='flex  flex-wrap rounded-md bg-white p-[10px] text-black  shadow-black'
      aria-label='Formatting options'
    >
      <Toolbar.ToggleGroup type='multiple' aria-label='Text formatting'>
        <Toolbar.ToggleItem
          className='text-mauve11 ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-white px-[5px] text-[13px] leading-none outline-none first:ml-0 hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 data-[state=on]:bg-violet5 data-[state=on]:text-red-500'
          value='bold'
          aria-label='Bold'
        >
          <MyTooltip content='Bold'>
            <button
              type='button'
              className={editor.isActive('bold') ? 'border-2' : ''}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FontBoldIcon />
            </button>
          </MyTooltip>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          className='text-mauve11 ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-white px-[5px] text-[13px] leading-none outline-none first:ml-0 hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 data-[state=on]:bg-violet5 data-[state=on]:text-red-500'
          value='italic'
          aria-label='Italic'
        >
          <button
            type='button'
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FontItalicIcon />
          </button>
        </Toolbar.ToggleItem>
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
          <SuperScriptIcon />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon />
        </button>
      </Toolbar.ToggleGroup>
      <Toolbar.ToggleGroup type='multiple' aria-label='Text formatting'>
        <div className='flex flex-row items-center gap-1'>
          <button
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
          </button>
          <button
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
          </button>
          <button
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
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive('heading', { level: 4 })
                ? 'is-active flex items-center'
                : 'flex items-center'
            }
          >
            <HeadingIcon />
            <p className='text-[15px]'>4</p>
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={
              editor.isActive('heading', { level: 5 })
                ? 'is-active flex items-center'
                : 'flex items-center'
            }
          >
            <HeadingIcon />
            <p className='text-[15px]'>5</p>
          </button>
          <button
            type='button'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={
              editor.isActive('heading', { level: 6 })
                ? 'is-active flex items-center'
                : 'flex items-center'
            }
          >
            <HeadingIcon />
            <p className='text-[15px]'>3</p>
          </button>
        </div>
      </Toolbar.ToggleGroup>
      <Toolbar.ToggleGroup type='multiple' aria-label='Text formatting'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Pencil1Icon />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          setHorizontalRule
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
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
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
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
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
        levels: [1, 2, 3, 4, 5, 6]
      }),
      CustomSuperscript,
      CustomSubscript,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'text-sm text-gray-600 bg-gray-100 p-2 rounded-md'
        }
      }),
      Underline,
      Highlight,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside ml-4'
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-inside ml-4'
        }
      }),
      ListItem,
      Paragraph,
      History,
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-500 underline'
        }
      }),
      TextStyle,

      CharacterCount.configure({
        limit
      }),
      Image.configure({
        HTMLAttributes: {
          class: ''
        }
      }),
      Typography
    ],
    content: content,

    editorProps: {
      attributes: {
        class:
          'p-4 mx-auto border border-t-0 prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full  text-sm m-5 focus:outline-non rounded-b-md mt-0 ',
        spellcheck: 'true'
      }
    }
  })
  //       class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',

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
