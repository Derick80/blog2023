import React from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from './ui/tooltip'
import clsx from 'clsx'
import { Pencil1Icon } from '@radix-ui/react-icons'

type EditableTextFieldProps = {
    initialValue?: string
    onUpdate?: (value: string) => void
    updateInitialValue?: (value: string) => void
    className?: string
    label?: string
}

const EditableTextField = ({
    initialValue,
    onUpdate,
    updateInitialValue,
    className,
    label
}: EditableTextFieldProps) => {
    const [value, setValue] = React.useState(initialValue)
    const [isEditing, setIsEditing] = React.useState(false)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value)
        updateInitialValue && updateInitialValue(event.target.value)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            setIsEditing(false)
            onUpdate && value && onUpdate(value)
            setValue(event.currentTarget.value) // Call the onUpdate function if it exists
        }
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
    }

    return (
        <>
            { isEditing ? (
                <Textarea
                    value={ value }
                    onChange={ handleInputChange }
                    onKeyDown={ handleKeyPress }
                    onBlur={ () => setIsEditing(false) }
                    autoFocus
                    className={ clsx(
                        'mt-1 h-12 w-full cursor-text transition-opacity duration-1000 ease-in-out focus:z-50 focus:border-blue-500',
                        'scale-100 opacity-100' // Ensure full opacity and scale when editing
                    ) }
                />
            ) : (
                <div className='flex w-full justify-between pl-1 pr-1'>
                    { label && ( // Conditionally render label if provided
                        <div className='mr-2 text-sm font-medium text-gray-700'>
                            { label }
                        </div>
                    ) }
                        <Tooltip>
                            <TooltipTrigger className='w-full'>
                                <div
                                    onClick={ handleDoubleClick }
                                    className={ clsx(
                                        'flex w-full cursor-text items-center justify-between',
                                        'transition-opacity duration-300 ease-in-out',
                                        {
                                            'opacity-100': !isEditing,
                                            'scale-95 opacity-0': isEditing // Apply scale and opacity transition when editing
                                        }
                                    ) }
                                >
                                    <span>{ value ? value : 'Click to edit' }</span>
                                    <Pencil1Icon className='h-4 w-4 text-gray-500' />
                                </div>
                                <TooltipContent>
                                    <span className='text-sm text-gray-500'>Click to edit</span>
                                </TooltipContent>
                            </TooltipTrigger>
                        </Tooltip>
                </div>
            ) }
        </>
    )
}

export default EditableTextField
