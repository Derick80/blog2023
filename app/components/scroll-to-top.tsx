import React from 'react'

import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'

// Used this resource to help build this component and replace the mantine component
// https://stackabuse.com/how-to-scroll-to-top-in-react-with-a-button-component/

export default function ScrollToTop () {
  const [showTopButton, setShowTopButton] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setShowTopButton(true)
      } else {
        setShowTopButton(false)
      }
    })
  }, [])

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='relative'>
      { showTopButton && (
        <Button
          className='fixed bottom-20 right-0 flex flex-col'
          variant='ghost'
          size='default'
          onClick={ goToTop }
        >

          <ArrowUpIcon />

        </Button>
      ) }
    </div>
  )
}
