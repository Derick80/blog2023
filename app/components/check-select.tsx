import React from 'react'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Cross1Icon, Cross2Icon } from '@radix-ui/react-icons'
import { DeleteIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubTrigger,
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
export const CheckSelect = ({ options, picked, postId }: Props) => {
    const [selected, setSelected] = React.useState(picked)
    const [open, setOpen] = React.useState(false)
    const [selectedCategories, setSelectedCategories] = React.useState<string>()

    React.useEffect(() => {
        setSelectedCategories(selected.map((item) => item.id).join(',') || '')

    }
        , [selected])

    console.log(selected, 'selected')

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
    const categorySubmitFetcher = useFetcher()
    const submitCategories = (id: string) => {
        setSelected(selected.filter((selectedItem) => selectedItem.id !== id)),
            console.log(id, selected, 'clicked'),

            categorySubmitFetcher.submit(
                {
                    intent: 'submit-categories',
                    postId: postId,
                    categories: selected.filter((selectedItem) => selectedItem.id !== id).map((item) => item.id).join(',')
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
            <div className='flex flex-row w-full gap-2 border-2 rounded h-24 md:h-12 flex-wrap overflow-auto p-1'>
                { selected.map((item) => (
                    <Badge
                        key={ item.id }
                        className='flex flex-row items-center justify-start px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'
                    >
                        <span className='mr-2'>{ item.label }</span>
                        <Button
                            variant='default'
                            size='sm'
                            type='button'
                            onClick={ () => submitCategories(item.id) }
                        >
                            <DeleteIcon className='w-4 h-4' />
                        </Button>
                    </Badge>
                )) }
            </div>
            <DropdownMenu
                open={ open }
                onOpenChange={
                    () => {
                        // determine if the dropdown is being close or opened
                        // if it's being closed we want to set the open state to false and then send the selected categories to the server
                        if (open === true) {
                            setOpen(false)
                            console.log(selected, 'slected onopenchange')
                        } else {
                            setOpen(true)
                        }
                    }
                }

            >
                <DropdownMenuTrigger className='mt-2 border-2 w-full'>
                    Select Categories
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className='w-full md:w-100 max-h-48 overflow-y-auto'
                // onInteractOutside={ () => setShowPanel(false) }
                // onFocusOutside={ () => setShowPanel(false) }
                >
                    <DropdownMenuLabel> Create a new category</DropdownMenuLabel>
                    <Input
                        className='w-full'
                        placeholder='New Category'
                        type='text'
                        name='new-category'
                        id='new-category'
                        onBlur={ (e) => {
                            createNewCategory(e)
                        } }
                    />
                    <Button variant='default' size='sm' type='button'>
                        Create
                    </Button>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>

                    { options.map((option, index) => (
                        <div
                            key={ option.id }
                            className='flex flex-row items-center justify-start w-full h-8'
                        >
                            <Checkbox
                                id={ option.id }
                                name='category-select'
                                value={ option.id }
                                checked={ selected.some((item) => item.id === option.id) }
                                onCheckedChange={ (checked) => {
                                    const isSelected = selected.some(
                                        (item) => item.id === option.id
                                    )
                                    if (isSelected) {
                                        setSelected((prevSelected) =>
                                            prevSelected.filter((item) => item.id !== option.id)
                                        )
                                    } else {
                                        const item = options.find((item) => item.id === option.id)
                                        if (item) {
                                            setSelected((prevSelected) => [...prevSelected, item])
                                        }
                                    }
                                    return checked
                                } }
                                onChange={ () => console.log('changed') }
                            />
                            <label
                                htmlFor={ option.label }
                                className='ml-2 text-sm font-medium text-gray-700'
                            >
                                { option.label }
                            </label>
                        </div>
                    )) }
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}

export default CheckSelect
