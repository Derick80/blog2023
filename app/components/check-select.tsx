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
import { useActionData, useFetcher } from '@remix-run/react'
import { action } from '~/routes/blog_.drafts_.$postId'

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
  const actionData = useActionData<typeof action>()
  const [selected, setSelected] = React.useState(picked)
  const [open, setOpen] = React.useState(false)
  const newCategoryInputRef = React.useRef<HTMLInputElement>(null)

  const categorySubmitFetcher = useFetcher()

  const handleCategoryToggle = (optionId: string) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === optionId)
      if (isSelected) {
        // Filter out the item and return the new array
        const remainingItems = prevSelected.filter(
          (item) => item.id !== optionId
        )
        const idToRemove = prevSelected
          .filter((item) => item.id === optionId)
          .map((item) => item.id)
          .join(',')

        categorySubmitFetcher.submit(
          {
            intent: 'submit-categories',
            postId: postId,
            refinedAction: 'remove',
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
              refinedAction: 'add',
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
        intent: 'newCategory',
        postId: postId,
        newCategory: newValue
      },
      {
        method: 'POST',
        action: `/blog/drafts/${postId}`
      }
    )
  }

  React.useEffect(
    function resetInputOnSuccess() {
      if (
        createNewCategoryFetcher.state === 'idle' &&
        createNewCategoryFetcher.data?.success
      ) {
        newCategoryInputRef.current!.value = ''
      }
    },
    [createNewCategoryFetcher.state, createNewCategoryFetcher.data]
  )

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open && selected.length > 0) {
      console.log('Dropdown closed with selected categories:', selected)
    }
  }
  // const handleOpenChange = (open: boolean) => {
  //   if (open) {
  //     setHasBeenOpened(true)
  //   } else if (hasBeenOpened) {
  //     console.log('closed', selected)
  //   }
  // }
  const removeCategoryFromDataBaseFetcher = useFetcher()

  const handleRemoveCategoryFromDataBase = (categoryId: string) => {
    removeCategoryFromDataBaseFetcher.submit(
      {
        intent: 'removeCategoryFromDataBase',
        postId: postId,
        categoryId: categoryId
      },
      {
        method: 'POST',
        action: `/blog/drafts/${postId}`
      }
    )
  }

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
            ref={newCategoryInputRef}
            placeholder='New Category'
            type='text'
            name='newCategory'
            id='newCategory'
            onBlur={(e) => {
              createNewCategory(e)
            }}
          />
          <Button variant='default' size='sm' type='button'>
            Create
          </Button>
          {createNewCategoryFetcher?.data?.errors && (
            <p id='title-error' className='text-red-500'>
              {actionData?.errors?.newCategory}
            </p>
          )}
          {createNewCategoryFetcher?.data && (
            <p id='title-error' className='text-green-500'>
              {JSON.stringify(
                createNewCategoryFetcher?.data?.errors?.newCategory,
                null,
                2
              )}
            </p>
          )}

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
              />
              <label
                htmlFor={option.label}
                className='ml-2 text-sm font-medium text-gray-700'
              >
                {option.label}
              </label>
              <Button
                variant='default'
                size='sm'
                type='button'
                onClick={() => {
                  handleRemoveCategoryFromDataBase(option.id)
                }}
              >
                <DeleteIcon className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CheckSelect
