import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CodeIcon, FontBoldIcon } from '@radix-ui/react-icons'

const MenuBar= ({editor}: {editor: Editor}) => {
  if (!editor) {
    return null
  }

  return (
    <div 
    className='flex flex-row justify-between items-center w-full p-2 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700'
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
        Italic
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleStrike().run()}>
        Strike
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleCode().run()}>
        <CodeIcon />
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </button>
      <button 
      type='button'
      onClick={() => editor.chain().focus().toggleSuperscript().run()}>
        Superscript
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleSubscript().run()}>
        Subscript
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleHighlight().run()}>
        Highlight
      </button>
      <button  
      type='button'
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </button>

    </div>
  )
}


const TipTap = ({ content }: { content?: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,

    editorProps: {
      attributes: {
        class: 'flex-1 p-4 h-[250px] mx-auto border text-black w-full text-sm m-5 focus:outline-non rounded-xl mt-0'
      }
    }

  })


  const schema = editor?.schema
  
  if (!editor) {
    return null
  }

  return (
    <>
      {/* <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Superscript />
            <RichTextEditor.Subscript />

            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />

            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <Button size='small' variant='primary_filled' onClick={addImage}>
              <ImageIcon />
            </Button>
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.ColorPicker
              colors={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14'
              ]}
            />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor> */}
      <MenuBar editor={editor} />
<EditorContent
  className='flex-1 p-4 h-[250px] mx-auto border text-black w-full text-sm m-5 focus:outline-non rounded-xl mt-0'

editor={editor} />
      <input type='hidden' name='content' value={editor?.getHTML()} />
    </>
  )
}

export default TipTap
