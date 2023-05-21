// SearchBar.tsx
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const variants = {
  open: { width: '250px', transition: { duration: 0.5 } },
  closed: { width: '0px', transition: { duration: 0.5 } }
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className='relative flex items-center'>
      <div
        className={`absolute right-0 top-0 transition-all duration-200 ease-in-out ${
          isOpen ? 'w-64' : 'w-0'
        } h-8 overflow-hidden rounded-full bg-white lg:static lg:w-64`}
      >
        <input
          type='text'
          className='h-full w-full border-none px-4 text-sm placeholder-gray-400'
          placeholder='Search...'
        />
      </div>
      <button
        className='z-10 ml-2 rounded-full bg-white p-2 text-black lg:hidden'
        onClick={isOpen ? handleClose : handleOpen}
      >
        <MagnifyingGlassIcon />
      </button>
      <div className='hidden lg:block'>
        <button className='ml-2 rounded-full bg-white p-2'>
          <MagnifyingGlassIcon />
        </button>
      </div>
    </div>
  )
}
