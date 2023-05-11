import React from 'react'
import { Portal } from './portal'
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

type Props = {
  options: { id: string; value: string; label: string }[]
  picked: { id: string; value: string; label: string }[]
  multiple?: boolean
  name?: string
}
export default function SelectBox({
  options,
  picked,
  multiple = false,
  name = 'selection'
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [selected, setSelected] = React.useState(picked)
  const [dropdown, setDropdown] = React.useState(false)

  const handleSelect = (value: string) => {
    const isSelected = selected.some((item) => item.value === value)
    if (multiple) {
      if (isSelected) {
        setSelected(selected.filter((item) => item.value !== value))
      } else {
        const item = options.find((item) => item.value === value)
        if (item) {
          setSelected([...selected, item])
        }
      }
    } else {
      if (isSelected) {
        setSelected(selected.filter((item) => item.value !== value))
      } else {
        const item = options.find((item) => item.value === value)
        if (item) {
          setSelected([item])
        }
      }
    }
  }

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
    <>
      <div
        ref={containerRef}
        id='picker'
        className='flex w-full  flex-row gap-2 rounded-md border-2 border-gray-200 p-3 dark:bg-slate-800'
      >
        {selected.map((item) => (
          <div
            className='flex justify-start rounded-md border bg-gray-200 p-2 dark:bg-slate-800 dark:text-slate-50'
            key={item.id}
          >
            <button type='button' onClick={() => handleSelect(item.value)}>
              {item.label}
            </button>
          </div>
        ))}

        <div className='flex flex-grow' />
        <button type='button' onClick={() => setDropdown(!dropdown)}>
          {dropdown ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
      <div>
        <Portal wrapperId='picker'>
          {dropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'tween' }}
              className='bottom-34 absolute left-[50%] z-30 mt-10 flex  h-fit flex-col  items-center gap-1 rounded-md border bg-white dark:bg-slate-800'
            >
              {options.map((item) => (
                <button
                  type='button'
                  className='flex w-full justify-start rounded-md bg-gray-200 p-4 hover:border-slate-700 dark:bg-slate-800'
                  key={item.id}
                  onClick={(e) => handleSelect(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </Portal>
      </div>
      <input
        type='hidden'
        name={name}
        value={selected.map((item) => item.value)}
      />
    </>
  )
}
