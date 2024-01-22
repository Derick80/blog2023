import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon
} from '@radix-ui/react-icons'
import { Editor } from '@tiptap/react'
import { Button } from '~/components/ui/button'
import { DropdownMenu } from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'

import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'

const ToolBar = ({ editor }: { editor: Editor }) => {
  return (
    <ToggleGroup
      type='multiple'
      className='flex p-[10px] pb-0 border-b w-full min-w-max justify-start rounded-md bg-background shadow-2xl shadow-black-50'
    >
      <ToggleGroupItem
        value='bold'
        variant='outline'
        size='sm'
        className={editor.isActive('bold') ? '' : 'accent-ring'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        asChild
      >
        <FontBoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='italic'
        size='sm'
        variant='outline'
        className={editor.isActive('bold') ? 'border-2' : ''}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        asChild
      >
        <FontItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='underline'
        size='sm'
        variant='outline'
        className={editor.isActive('bold') ? 'border-2' : ''}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        asChild
      >
        <UnderlineIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='strikethrough' asChild>
        <Button
          type='button'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          asChild
        >
          <StrikethroughIcon />
        </Button>
      </ToggleGroupItem>
      <ToggleGroupItem value='code'>
        <Button
          type='button'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleCode().run()}
          asChild
        >
          <CodeIcon />
        </Button>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default ToolBar

{
  /* <div
    className="flex p-[10px] w-full min-w-max rounded-md bg-background shadow-[0_2px_10px] shadow-blackA4"
    aria-label="Formatting options"
>
</div> */
}
