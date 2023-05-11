import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import React from 'react'
import Button from './button'

export default function VerticalMenu({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

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
    <div
      className='relative'

      // className='relative'
    >
      <Button
        className=''
        onClick={() => setOpen(!open)}
        variant='ghost'
        size='tiny'
      >
        {!open ? (
          <DotsVerticalIcon className='h-6 w-6' />
        ) : (
          <DotsHorizontalIcon className='h-6 w-6' />
        )}
      </Button>

      {open && (
        <div className='fixed z-10 flex w-fit flex-col gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-900'>
          {children}
        </div>
      )}
    </div>
  )
}
