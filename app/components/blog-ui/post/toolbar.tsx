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
        className={ editor.isActive('bold') ? '' : 'text-primary' }
        onClick={ () => editor.chain().focus().toggleBold().run() }

      >
        <FontBoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='italic'
        size='sm'
        variant='outline'
        className={ editor.isActive('bold') ? 'border-2' : '' }
        onClick={ () => editor.chain().focus().toggleItalic().run() }

      >
        <FontItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='underline'
        size='sm'
        variant='outline'
        className={ editor.isActive('bold') ? 'border-2' : '' }
        onClick={ () => editor.chain().focus().toggleUnderline().run() }
      >
        <UnderlineIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='underline'
        size='sm'
        variant='outline'
        className={ editor.isActive('bold') ? 'border-2' : '' }
        onClick={ () => editor.chain().focus().toggleStrike().run() }

      >
        <StrikethroughIcon />

      </ToggleGroupItem>
      <ToggleGroupItem value='code'

        type='button'
        size='sm'
        variant='outline'
        className={ editor.isActive('bold') ? 'border-2' : '' }
        onClick={ () => editor.chain().focus().toggleCode().run() }

      >
        <CodeIcon />
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
