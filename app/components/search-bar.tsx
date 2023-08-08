// SearchBar.tsx
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Form, useNavigate, useSearchParams } from '@remix-run/react'
import React from 'react'

// Search bar component. Can target any route in the app to search for a query

export default function SearchBar({ appRoute }: { appRoute: string }) {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const formRef = React.useRef<HTMLFormElement>(null)

  const [search, setSearch] = React.useState('')
  function handleReset(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    searchParams.delete('filter')
    navigate(formRef.current?.action || appRoute)
    setSearch('')
  }

  return (
    <Form className='relative flex items-center'>
      <div
        className={`'w-64' : 'w-0' } absolute right-0 top-0 h-8 overflow-hidden
        rounded-full bg-white transition-all duration-200 ease-in-out lg:static lg:w-64`}
      >
        <input
          type='text'
          className='h-full w-full border-none px-4 text-sm placeholder-gray-500'
          placeholder='Search...'
          name='filter'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className='hidden lg:block'>
        <button className='ml-2 rounded-full bg-slate-50  p-2 dark:bg-slate-900'>
          <MagnifyingGlassIcon />
        </button>
        {search && (
          <button
            className='ml-2 rounded-full bg-slate-50  p-2 dark:bg-slate-900'
            onClick={handleReset}
            type='submit'
          >
            <Cross1Icon />
          </button>
        )}
      </div>
    </Form>
  )
}
