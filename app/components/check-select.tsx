import React from 'react'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { DeleteIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { CheckboxProps } from '@radix-ui/react-checkbox'
import { Input } from './ui/input'
import { useFetcher } from '@remix-run/react'

type Props = {
  options: {
    id: string
    value: string
    label: string
  }[]
  picked: {
    id: string
    value: string
    label: string
  }[]
  postId: string
}

type Checked = CheckboxProps['checked']
const CheckSelect = ({ options, picked, postId }: Props) => {
  const [selected, setSelected] = React.useState(picked)
  const [open, setOpen] = React.useState(false)
  const [selectedCategories, setSelectedCategories] = React.useState<string>()
  const [hasBeenOpened, setHasBeenOpened] = React.useState(false)
  const categorySubmitFetcher = useFetcher()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open && selected.length > 0) {
      console.log('Dropdown closed with selected categories:', selected)
    }
  }

  const handleCategoryToggle = (optionId: string) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === optionId)
      if (isSelected) {
        // Filter out the item and return the new array
        const remainingItems = prevSelected.filter(
          (item) => item.id !== optionId
        )
        console.log(remainingItems, 'remainingItems') // Log the remaining items
        const idToRemove = prevSelected
          .filter((item) => item.id === optionId)
          .map((item) => item.id)
          .join(',')

        categorySubmitFetcher.submit(
          {
            intent: 'submit-categories',
            postId: postId,
            refinedAction: 'DELETE',
            categories: idToRemove
          },
          {
            method: 'POST',
            action: `/blog/drafts/${postId}`
          }
        )
        return remainingItems // Return the new state as an array
      } else {
        // Add the new item to the array and return it
        const newItem = options.find((item) => item.id === optionId)

        if (newItem) {
          categorySubmitFetcher.submit(
            {
              intent: 'submit-categories',
              postId: postId,
              refinedAction: 'POST',
              categories: newItem.id
            },
            {
              method: 'POST',
              action: `/blog/drafts/${postId}`
            }
          )
        }
        return newItem ? [...prevSelected, newItem] : prevSelected
      }
    })
  }

  const createNewCategoryFetcher = useFetcher()

  const createNewCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    createNewCategoryFetcher.submit(
      {
        intent: 'new-category',
        postId: postId,
        newCategory: newValue
      },
      {
        method: 'POST',
        action: `/blog/drafts/${postId}`
      }
    )
  }

  // const handleOpenChange = (open: boolean) => {
  //   if (open) {
  //     setHasBeenOpened(true)
  //   } else if (hasBeenOpened) {
  //     console.log('closed', selected)
  //   }
  // }

  return (
    <div className='relative flex flex-col items-start justify-start h-full p-2 overflow-y-auto bg-background text-foreground rounded-md shadow-sm'>
      <Label htmlFor='selected-categories'>Selected Categories</Label>
      <div className='flex flex-row w-full gap-2 rounded flex-wrap overflow-auto p-1'>
        {selected.map((item) => (
          <Badge key={item.id}>
            <span className='mr-2'>{item.label}</span>
            <Button
              variant='default'
              size='sm'
              type='button'
              onClick={() => {
                handleCategoryToggle(item.id)
              }}
            >
              <DeleteIcon className='w-4 h-4' />
            </Button>
          </Badge>
        ))}
      </div>
      <DropdownMenu
        onOpenChange={() => {
          setOpen(!open)
          handleOpenChange(open)
        }}
      >
        <DropdownMenuTrigger className='mt-2 border-2 w-full'>
          Select Categories
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-full md:w-100 max-h-48 overflow-y-auto'>
          <DropdownMenuLabel> Create a new category</DropdownMenuLabel>
          <Input
            className='w-full'
            placeholder='New Category'
            type='text'
            name='new-category'
            id='new-category'
            onBlur={(e) => {
              createNewCategory(e)
            }}
          />
          <Button variant='default' size='sm' type='button'>
            Create
          </Button>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Categories</DropdownMenuLabel>

          {options.map((option, index) => (
            <div
              key={option.id}
              className='flex flex-row items-center justify-start w-full h-8'
            >
              <Checkbox
                id={option.id}
                name='category-select'
                value={option.id}
                checked={selected.some((item) => item.id === option.id)}
                onCheckedChange={(checked) => {
                  handleCategoryToggle(option.id)

                  return checked
                }}
                onChange={() => [console.log('changed')]}
              />
              <label
                htmlFor={option.label}
                className='ml-2 text-sm font-medium text-gray-700'
              >
                {option.label}
              </label>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CheckSelect
