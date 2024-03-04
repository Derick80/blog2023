import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  ImageIcon,
  StrikethroughIcon,
  UnderlineIcon
} from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Editor } from '@tiptap/react'
import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { Button } from '~/components/ui/button'
import { Post } from '~/server/schemas/schemas'
import ImageController from '~/components/images/image-controller'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

const ToolBar = ({
  editor,
  post
}: {
  editor: Editor
  post?: Pick<Post, 'id' | 'title' | 'imageUrl' | 'postImages'>
}) => {
  const [open, setOpen] = React.useState(false)
  console.log(open, 'open')

  const [imageLink, setImageLink] = React.useState('')
  console.log(imageLink, 'imageLink')

  const addImage = React.useCallback(
    ({ url }: { url: string }) => {
      if (url) {
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: `A image replacement for ${url}` })
          .run()
      }
    },
    [editor]
  )

  if (!editor) return null

  return (
    <div className='flex  flex-wrap justify-between items-center w-full p-2 rounded-sm bg-background shadow-2xl shadow-black-50'>
      <HeadingDropdown editor={editor} />
      <ToggleGroup
        type='multiple'
        className='flex pt-2 pb-0 w-full rounded-sm bg-background shadow-2xl shadow-black-50'
      >
        <ToggleGroupItem
          value='bold'
          variant='outline'
          size='sm'
          className={editor.isActive('bold') ? '' : 'text-primary'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FontBoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='italic'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FontItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='underline'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='underline'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value='code'
          type='button'
          size='sm'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value={imageLink}
          size='sm'
          type='button'
          variant='outline'
          className={editor.isActive('bold') ? 'border-2' : ''}
          onChange={() => addImage({ url: imageLink })}
          onBlur={() => addImage({ url: imageLink })}
        >
          Image
          <ImageIcon />
        </ToggleGroupItem>

        {/* <Popover>
      <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>

    </PopoverTrigger>
    <PopoverAnchor />
      <PopoverContent>
      <ImageController
        post={post}
        />
      </PopoverContent>
    </Popover> */}
        {/* {
      editor && ( <ToggleGroupItem
      value='link'
      size='sm'
      type='button'
      variant='outline'
      className={ editor.isActive('bold') ? 'border-2' : '' }
      onClick={ setLink }
    asChild>
      <Drawer
    aria-label='Image Controller'
          modal={ true }

    >
          <DrawerTrigger asChild>

      <Button variant='outline'>Image</Button>
          </DrawerTrigger>
                      <DrawerContent>
      <div className="mx-auto w-full max-w-sm">

           <DrawerHeader>
        <DrawerTitle>Image Controller</DrawerTitle>
        <DrawerDescription>Upload and manage images</DrawerDescription>
      </DrawerHeader>
          <DrawerPortal>



<DrawerHeader>
        <DrawerTitle>Image Controller</DrawerTitle>
        <DrawerDescription>Upload and manage images</DrawerDescription>
      </DrawerHeader>
      <ImageController post={post} />
              </DrawerPortal>
            <DrawerFooter>
                <DrawerClose

                  asChild>

                  <Button variant='outline'>Close</Button>
                </DrawerClose>
              </DrawerFooter>
              </div>
                          </DrawerContent>

  </Drawer>
      </ToggleGroupItem>)

   } */}

        {editor && (
          <ToggleGroupItem
            value='link'
            size='sm'
            type='button'
            variant='outline'
            className={editor.isActive('bold') ? 'border-2' : ''}
            asChild
          >
            <Dialog
              aria-label='Image Controller'
              modal={true}
              open={open}
              onOpenChange={setOpen}
            >
              <DialogTrigger asChild>
                <Button variant='outline'>Link</Button>
              </DialogTrigger>
              <DialogContent>
                <ImageController
                  editor={editor}
                  post={post}
                  setImageLink={setImageLink}
                  setOpen={setOpen}
                />
              </DialogContent>
            </Dialog>
          </ToggleGroupItem>
        )}
      </ToggleGroup>
    </div>
  )
}

export default ToolBar

const HeadingDropdown = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const headings = [1, 2, 3, 4, 5, 6]

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  const handleHeadingSelect = (level: {}) => {
    editor.chain().focus().toggleHeading({ level }).run()
    toggleDropdown()
  }

  return (
    <Select value='Headings'>
      <SelectTrigger asChild>
        <Button variant='outline' size='sm' onClick={toggleDropdown}>
          Headings
        </Button>
      </SelectTrigger>
      <SelectContent>
        {headings.map((heading) => (
          <SelectItem
            key={heading}
            value={heading.toString()}
            onSelect={() => handleHeadingSelect(heading)}
          >
            {heading}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant='outline'
//           size='sm'
//           onClick={ toggleDropdown }
//         >
//           Headings

//         </Button>

//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Profile</DropdownMenuItem>
//         <DropdownMenuItem>Billing</DropdownMenuItem>
//         <DropdownMenuItem>Team</DropdownMenuItem>
//         <DropdownMenuItem>Subscription</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
