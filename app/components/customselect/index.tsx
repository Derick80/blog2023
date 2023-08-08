import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { set } from 'date-fns'
import React from 'react'

export type CustomSelectProps = {
  children?: React.ReactNode
  selected?: string
  selectOptions: { value: string }[]
  setStatus: React.Dispatch<React.SetStateAction<string>>
  formInputName: string
}
export default function CustonSelect({
  children,
  selected,
  selectOptions,
  setStatus,
  formInputName
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [picked, setPicked] = React.useState(selected)
  function handleOpen() {
    setOpen(!open)
  }

  function handleSelect(event: React.MouseEvent<HTMLButtonElement>) {
    const updatedSelection = event.currentTarget.textContent
    setPicked(updatedSelection || '')

    setStatus(updatedSelection || '')
    setOpen(false)
  }

  return (
    <div className='w-[200px]  rounded-lg bg-white p-2 shadow-md dark:bg-blue-800'>
      <div className='flex items-center justify-between gap-2 p-2'>
        <p className=''>{picked}</p>
        <button className='' onClick={handleOpen}>
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
      <ul className='absolute z-50 flex h-fit w-fit flex-col rounded-md bg-white dark:bg-blue-800'>
        {open &&
          selectOptions.map((option) => (
            <button
              className='mt-2 rounded-md bg-blue-800 p-1 shadow-lg'
              onClick={handleSelect}
              key={option.value}
              value={option.value}
              type='button'
            >
              <li
                value={option.value}
                className={
                  option.value === picked ? 'text-white' : 'text-black'
                }
              >
                {option.value}
              </li>
            </button>
          ))}
      </ul>
      <input type='hidden' name={formInputName} value={picked} />
    </div>
  )
}
