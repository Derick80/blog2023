import React from 'react'
import { Portal } from './portal'
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'


type Props = {
  options: { id: string; value: string; label: string }[]
  picked: { id: string; value: string; label: string }[]
  multiple?: boolean
}
export default function PickerVers({
  options,
  picked,
    multiple = false

}: Props) {
  const [selected, setSelected] = React.useState(picked)

  const handleSelect = (id: string) => {
    const isSelected = selected.some((item) => item.id === id)
    if(multiple){
        if (isSelected) {
            setSelected(selected.filter((item) => item.id !== id))
          } else {
            const item = options.find((item) => item.id === id)
            if (item) {
              setSelected([...selected, item])
            }
          }
    }
    else{
        if (isSelected) {
            setSelected(selected.filter((item) => item.id !== id))
          } else {
            const item = options.find((item) => item.id === id)
            if (item) {
              setSelected([item])
            }
          }
    }

  }

  const [dropdown, setDropdown] = React.useState(false)
  return (
    <>
      <div
         id='picker'
        className='flex w-full  flex-row gap-2 rounded-md border-2 border-gray-200 p-3 dark:bg-slate-800'
      >
        {selected.map((item) => (
          <div
            //  id='picker'
            className='flex justify-start rounded-md border bg-gray-200 p-2 dark:bg-slate-800 dark:text-slate-50'
            key={item.id}
          >
            <button onClick={() => handleSelect(item.id)}>{item.label}</button>
          </div>
        ))}

        <div className='flex flex-grow' />
        <button onClick={() => setDropdown(!dropdown)}>
          {dropdown ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>
      <div>
        <Portal wrapperId='picker'>
          {dropdown && (
            <div className='absolute bottom-34 left-[50%] z-30 mt-10 flex  h-fit flex-col  items-center gap-1 rounded-md border bg-white dark:bg-slate-800'>
              {options.map((item) => (
                <button
                  className='flex w-full justify-start rounded-md bg-gray-200 p-4 hover:border-slate-700 dark:bg-slate-800'
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </Portal>
      </div>
      <input
        type='hidden'
        name='selection'
        value={selected.map((item) => item.id)}
      />
    </>
  )
}
