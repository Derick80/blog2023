import { Cross1Icon, PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons'

import React from 'react'
import { useFetcher } from 'react-router-dom'

export default function TaskCategoryForm() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [taskCategory, setTaskCategory] = React.useState('')
  const taskCategoryFetcher = useFetcher()

  const onClick = () => {
    taskCategoryFetcher.submit(
      {
        taskCategory: taskCategory
      },
      {
        method: 'POST',
        action: `/documentation/task/taskCategory/new/${taskCategory}`
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
            name='newTaskCategory'
            value={taskCategory}
            onChange={(e) => {
              setTaskCategory(e.target.value)
            }}
            placeholder='enter a new task category...'
            className='m-0 w-3/4 rounded-md border-none text-black'
          />
          <button type='submit' onClick={() => onClick()} className=''>
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
