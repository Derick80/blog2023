import React from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'

type Props = {
  testOptions?: string[]
  options: { id: string; value: string; label: string }[]
  picked: { id: string; value: string; label: string }[]
  multiple?: boolean
  name?: string
}
export default function SelectBox({
  options,
  picked,
  multiple = false,
  name = 'selection',
  testOptions
}: Props) {
  // convert testOptions to options
  if (testOptions) {
    options = testOptions.map((item) => ({
      id: item,
      value: item,
      label: item
    }))
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selected, setSelected] = React.useState(picked)
  const [dropdown, setDropdown] = React.useState(false)

  const handleSelect = React.useCallback(
    (value: string) => {
      const isSelected = selected.some((item) => item.value === value)
      if (multiple) {
        if (isSelected) {
          setSelected((prevSelected) =>
            prevSelected.filter((item) => item.value !== value)
          )
          setDropdown(false)
        } else {
          const item = options.find((item) => item.value === value)
          if (item) {
            setSelected((prevSelected) => [...prevSelected, item])
            setDropdown(false)
          }
        }
      } else {
        if (isSelected) {
          setSelected((prevSelected) =>
            prevSelected.filter((item) => item.value !== value)
          )
          setDropdown(false)
        } else {
          const item = options.find((item) => item.value === value)
          if (item) {
            setSelected([item])
            setDropdown(false)
          }
        }
      }
    },
    [selected, multiple, options]
  )

  //   Allow user to close dropdown by pressing the escape key
  //  I was guided by this article https://github.com/WebDevSimplified/react-select
  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdown(false)
      }
    }
    document.addEventListener('keydown', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [])

  return (
    <div className='relative inline-block w-48 ' ref={containerRef}>
      <div className='blck'>
        <button
          type='button'
          className='flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          onClick={() => setDropdown(!dropdown)}
        >
          {selected.length > 0
            ? selected.map((item) => item.label).join(', ')
            : 'Select an option'}

          {dropdown ? (
            <ChevronUpIcon className='h-5 w-5 text-gray-500' />
          ) : (
            <ChevronDownIcon className='h-5 w-5 text-gray-500' />
          )}
        </button>
        {dropdown && (
          <div className='absolute left-0 right-0  mt-2 rounded-md border border-gray-300 bg-white shadow-lg'>
            <div className='absolute -top-3 right-[45%] h-6 w-6 rotate-45 border-l border-t border-gray-300 bg-white' />

            <ul className=''>
              {options.map((option, index) => (
                <>
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option.value)}
                    className='list-none px-4 py-2 text-black hover:bg-gray-100'
                  >
                    {option.label}
                  </li>
                </>
              ))}
            </ul>
          </div>
        )}
      </div>
      <input
        type='hidden'
        name={name}
        value={selected.map((item) => item.value).join(',')}
      />
    </div>
  )
}
