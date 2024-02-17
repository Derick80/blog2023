import React from 'react'
import { Input } from './ui/input'
import { CornerDownLeft, CornerLeftDownIcon, Pencil } from 'lucide-react'

type EditableTextFieldProps = {
  initialValue?: string
}

const EditableTextField = ({ initialValue }: EditableTextFieldProps) => {
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(!isEditing)
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  return (
    <div className='relative w-full'>
      {isEditing ? (
        <>
          <Input
            type='text'
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className='border-b border-gray-500 focus:border-blue-500 w-full pr-10'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 px-2 py-1 text-blue-500 hover:text-blue-700 focus:outline-none'
          >
                      <CornerDownLeft
            size='14'

                      /> {/* Icon for saving */ }
          </button>
        </>
      ) : (
        <>
                      <Input onClick={ handleDoubleClick } className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground pr-10 outline-none ring-1 ring-ring border-b cursor-text' value={
                          value ? value : 'Click to edit'
                        } />


          <button
            type='button'
            className='absolute inset-y-0 right-0 px-2 py-1 text-blue-500 hover:text-blue-700 focus:outline-none'
          >
            <Pencil size='14' />
          </button>
        </>
      )}
    </div>
  )
}

export default EditableTextField
