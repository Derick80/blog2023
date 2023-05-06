import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import React from 'react'
import Button from './button'
import { Portal } from './portal'

export default function VerticalMenu({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(true)

  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
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
    id='vertical-menu'
      className='relative'
   >
      <Button onClick={() => setOpen(!open)} variant='ghost' size='tiny'>
        {!open ? (
          <DotsVerticalIcon className='h-6 w-6' />
        ) : (
          <DotsHorizontalIcon className='h-6 w-6' />
        )}
      </Button>
      
    </div>

{open && (
  <Portal wrapperId='vertical-menu'>
    <div
      className='absolute z-50 top-6 flex flex-col gap-2 bg-white dark:bg-slate-900 shadow-lg rounded-lg p-2'
  >
    {children}
  </div>
  </Portal>
)}
</>
  )
}
