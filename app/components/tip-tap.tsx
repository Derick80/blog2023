import { Editor} from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CodeIcon, FontBoldIcon, FontItalicIcon, HeadingIcon, ImageIcon, Link1Icon, LinkBreak1Icon, ListBulletIcon, Pencil1Icon, PersonIcon, StrikethroughIcon, UnderlineIcon } from '@radix-ui/react-icons'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Underline from '@tiptap/extension-underline'
import highlight from '@tiptap/extension-highlight'
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link'
import React from 'react';
import TextStyle from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'


import Typography from '@tiptap/extension-typography';
import Heading from '@tiptap/extension-heading'



const MenuBar= ({editor}: {editor: Editor}) => {
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
      editor?.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div 
    className='flex flex-row rounded-t-md  flex-grow justify-between items-center w-full p-2 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 text-white'
    >
      <button 
      type='button'
      className={editor.isActive('bold') ? 'is-active' : ''}

      onClick={() => editor.chain().focus().toggleBold().run()}>
        <FontBoldIcon />
      </button>
      <button 
      type='button'
      onClick={() => editor.chain().focus().toggleItalic().run()}>
       <FontItalicIcon />
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughIcon />
      </button>
     
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon />
      </button>
      <button 
      type='button'
      onClick={() => editor.chain().focus().toggleSuperscript().run()}>
       <svg 
        className='fill-slate-50'
       xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M11 7V20H9V7H3V5H15V7H11ZM19.5507 6.5803C19.7042 6.43453 19.8 6.22845 19.8 6C19.8 5.55817 19.4418 5.2 19 5.2C18.5582 5.2 18.2 5.55817 18.2 6C18.2 6.07624 18.2107 6.14999 18.2306 6.21983L17.0765 6.54958C17.0267 6.37497 17 6.1906 17 6C17 4.89543 17.8954 4 19 4C20.1046 4 21 4.89543 21 6C21 6.57273 20.7593 7.08923 20.3735 7.45384L18.7441 9H21V10H17V9L19.5507 6.5803V6.5803Z"></path></svg>
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleSubscript().run()}>
<svg
className='fill-slate-50'
color='currentColor'
xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path
    
d="M11 6V19H9V6H3V4H17V6H11ZM19.5507 16.5803C19.7042 16.4345 19.8 16.2284 19.8 16C19.8 15.5582 19.4418 15.2 19 15.2C18.5582 15.2 18.2 15.5582 18.2 16C18.2 16.0762 18.2107 16.15 18.2306 16.2198L17.0765 16.5496C17.0267 16.375 17 16.1906 17 16C17 14.8954 17.8954 14 19 14C20.1046 14 21 14.8954 21 16C21 16.5727 20.7593 17.0892 20.3735 17.4538L18.7441 19H21V20H17V19L19.5507 16.5803V16.5803Z"></path></svg>      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Pencil1Icon />
      </button>

      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
                <HeadingIcon /><p className='text-[15px]'>1</p>

      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <HeadingIcon /><p className='text-[15px]'>1</p>
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <HeadingIcon /><p className='text-[15px]'>1</p>
      </button>
      <button 
      type='button'
      onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
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
      onClick={addImage}>
       
 <ImageIcon />
      </button>
      <button
      type='button'
      className={editor.isActive('bulletList') ? 'is-active' : ''}
      onClick={()=> editor.chain().focus().toggleBulletList().run()}>
        <ListBulletIcon />
      </button> 

    <button 
    type='button'
    onClick={()=> editor.chain().focus().toggleOrderedList().run()}
    
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
          levels: [1, 2, 3],
        },
      }),
      Heading,
      Superscript,
      SubScript,
      Underline,
      highlight,
      Code,
      Link,
      TextStyle,
      BulletList,
      OrderedList,
      ListItem,

      CharacterCount.configure({
        limit,
      }),
      Image,
      Typography,
      
    
    ],
    content: content,

    editorProps: {
      attributes: {
        class: 'flex-1 p-4 mx-auto border border-t-0 text-black dark:text-slate-50 w-full h-auto text-sm m-5 focus:outline-non rounded-b-md mt-0 '
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
<EditorContent

editor={editor} />
      <input type='hidden' name='content' value={editor?.getHTML()} />
      <div className="text-xs flex gap-1 items-center justify-end">
<p className="text-gray-500">
{editor.storage.characterCount.characters()}/{limit} characters
</p>     
<p className="text-gray-500">
{editor.storage.characterCount.words()} words

</p>  
      </div>
    </>
  )
}

export default TipTap
