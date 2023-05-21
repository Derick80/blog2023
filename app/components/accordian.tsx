import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

type AccordionProps = {
  title: string
  children: React.ReactNode
}

const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <button
        className='flex items-center justify-between'
        type='button'
        onClick={handleToggle}
      >
        {title} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen &&
        ReactDOM.createPortal(
          children,
          document.getElementById('portal-root') as HTMLElement
        )}
    </div>
  )
}

export default Accordion
