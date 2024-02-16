// I want to create an element that can be edited in place. I want to be able to click on the element and have it turn into an input field. I want to be able to click away from the input field and have it turn back into a regular element. I want to be able to submit the input field and have it turn back into a regular element.

import React from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
type EditableElementProps = {
  value?: string
  onChange: (value: string) => void
}

const EditableElement = ({
  value,
  onChange,
  ...props
}: EditableElementProps) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      onChange(inputValue || 'comment here')
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <div
      className='w-full min-h-8 h-auto bg-secondary text-primary'
      onClick={() => setIsEditing(true)}
      {...props}
    >
      {isEditing ? (
        <Textarea
          placeholder='comment here'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}

export default EditableElement
