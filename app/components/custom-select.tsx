import React from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  Cross1Icon,
  PlusCircledIcon
} from '@radix-ui/react-icons'
import TaskCategoryForm from './documentation/task-category-form'
import { useFetcher } from '@remix-run/react'
import { set } from 'date-fns'
import { action } from '~/routes/_auth.logout'

type Props = {
  options: string[]
  picked: string[]
  multiple?: boolean
  name?: string
  creatable?: boolean
  actionPath?: string
}
export default function CustomSelectBox({
  options,
  picked,
  multiple = false,
  name = 'selection',
  creatable = false,
  actionPath
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selected, setSelected] = React.useState(picked)
  const [dropdown, setDropdown] = React.useState(false)

  const handleSelect = React.useCallback(
    (value: string) => {
      const isSelected = selected.some((item) => item === value)
      if (multiple) {
        if (isSelected) {
          setSelected((prevSelected) =>
            prevSelected.filter((item) => item !== value)
          )
          setDropdown(false)
        } else {
          const item = options.find((item) => item === value)
          if (item) {
            setSelected((prevSelected) => [...prevSelected, item])
            setDropdown(false)
          }
        }
      } else {
        if (isSelected) {
          setSelected((prevSelected) =>
            prevSelected.filter((item) => item !== value)
          )
          setDropdown(false)
        } else {
          const item = options.find((item) => item === value)
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
            ? selected.map((item) => item).join(', ')
            : 'Select an option'}

          {dropdown ? (
            <ChevronUpIcon className='h-5 w-5 text-gray-500' />
          ) : (
            <ChevronDownIcon className='h-5 w-5 text-gray-500' />
          )}
        </button>

        {dropdown && (
          <div className='absolute left-0 right-0 z-10 mt-2 rounded-md border border-gray-300 bg-white shadow-lg'>
            <div className='absolute -top-3 right-[45%] h-6 w-6 rotate-45 border-l border-t border-gray-300 bg-white' />

            <ul className='m-0 list-none py-1'>
              <li className='list-none px-4 py-2 text-black hover:bg-gray-100'>
                {creatable && actionPath && (
                  <CreateNewCategoryForm
                    actionPath={actionPath}
                    setSelected={setSelected}
                    setDropdown={setDropdown}
                  />
                )}
              </li>
              {options.map((option, index) => (
                <>
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    className='list-none px-4 py-2 text-black hover:bg-gray-100'
                  >
                    {option}
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
        value={selected.map((item) => item).join(',')}
      />
    </div>
  )
}

function CreateNewCategoryForm({
  actionPath,
  setSelected,
  setDropdown
}: {
  actionPath: string
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [category, setCategory] = React.useState('')

  const categoryCreateFetcher = useFetcher()
  const actionRoute = `${actionPath}${category}`

  const handleCategorySubmit = () => {
    categoryCreateFetcher.submit(
      {
        category: category
      },
      {
        method: 'POST',
        action: actionRoute
      }
    )
    setExpanded(false)
  }
  return (
    <>
      {expanded ? (
        <div className='flex w-full flex-row items-center gap-2'>
          <input
            ref={inputRef}
            type='text'
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
            }}
            placeholder='enter a new task category...'
            className='m-0 w-3/4 rounded-md border-none text-black'
          />
          <button
            type='submit'
            onClick={() => handleCategorySubmit()}
            className=''
          >
            <PlusCircledIcon />
          </button>
          <button onClick={() => setExpanded(false)}>
            <Cross1Icon />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className='inline-flex items-center gap-1 text-black md:gap-2  lg:gap-3'
        >
          <PlusIcon />
          <p className='text-xs text-black'>New Task Category</p>
        </button>
      )}
    </>
  )
}
