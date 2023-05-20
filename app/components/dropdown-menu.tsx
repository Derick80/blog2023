import React, { useState } from 'react'
import clsx from 'clsx'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon
} from '@radix-ui/react-icons'

type Props = {
  options: { id: string; value: string; label: string }[]
  name?: string
  width?: string
}
const Dropdown = ({ options, name = 'selection', width = 'w-48' }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleIconClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setSelectedOption('')
  }

  const handleTextClear = (event: React.MouseEvent<HTMLSpanElement>) => {
    setSelectedOption('')
    setIsOpen(false)
    }
    //   Allow user to close dropdown by pressing the escape key


    const handleDelayedClose = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 2000); // Adjust the delay time (in milliseconds) as needed
    };
  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [])
  const handleOptionSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    const selectedOption = event.currentTarget.textContent
    setSelectedOption(selectedOption || '')
    setIsOpen(false)
  }
  return (
    <div className={clsx(`relative inline-block ${width}`)}>
      <div className='block'>
        <button
          type='button'
          className='flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          onClick={handleToggle}
        >
          <div className='flex w-full items-center justify-between'>
            {selectedOption ? (
                <>
              <span
                className='flex items-center'
                onClick={() => setSelectedOption('')}
              >
                {selectedOption}
              </span>
              <button onClick={handleIconClear}>
              <Cross2Icon className='h-[15px] w-[15px]' />
            </button>
            </>
            ) : (
              <span className='flex items-center'>
                <span className='mr-3'>Select an option</span>
              </span>
            )}
          </div>
        
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>

        {isOpen && (
          <div
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleDelayedClose}
          className='absolute left-0 right-0  mt-2 rounded-md border border-gray-300 bg-white shadow-lg'>
            <div className='absolute -top-3 right-[45%] h-6 w-6 rotate-45 border-l border-t border-gray-300 bg-white' />

            <ul className='py-1'>
              <li
                className='px-4 py-2 text-black hover:bg-gray-100'
                onClick={
                        handleTextClear
                }
              >
                Clear
              </li>

              {options.map((option, index) => (
                <li
                  key={option.id}
                  onClick={handleOptionSelect}
                  className='px-4 py-2 text-black hover:bg-gray-100'
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
     
        <input type='hidden' name={name} value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
        />
  
    </div>
  )
}

export default Dropdown
