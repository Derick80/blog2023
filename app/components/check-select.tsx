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
    const [showPanel, setShowPanel] = React.useState(false)

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

    return (
        <div className='relative flex flex-col items-start justify-start h-full p-2 overflow-y-auto bg-background text-foreground rounded-md shadow-sm'>
            <Label htmlFor='selected-categories'>Selected Categories</Label>
            <div className='flex flex-row w-full gap-2 border-2 rounded h-24 md:h-12 flex-wrap overflow-auto p-1'>
                { selected?.map((item) => (
                    <Button
                        key={ item.id }
                        onClick={
                            () => [console.log(item.id, selected, 'clicked'),

                            setSelected(selected.filter((selectedItem) => selectedItem.id !== item.id))

                            ]

                        }

                        variant='secondary'
                        size='sm'
                        type='button'
                        className='px-1'
                    >
                        { item.label } <Cross2Icon className='w-4 h-4 ml-1' />
                    </Button>
                )) }
            </div>
            <DropdownMenu>
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
