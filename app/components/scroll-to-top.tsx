import React from 'react'
import Button from './v3-components/button'
import { ArrowUpIcon } from '@radix-ui/react-icons'

// Used this resource to help build this component and replace the mantine component
// https://stackabuse.com/how-to-scroll-to-top-in-react-with-a-button-component/

export default function ScrollToTop() {
  const [showTopButton, setShowTopButton] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
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
      {showTopButton && (
        <Button
          className='fixed bottom-5 right-5'
          variant='icon_text_filled'
          size='base'
          onClick={goToTop}
        >
          <ArrowUpIcon />
          Scroll to top
        </Button>
      )}
    </div>
  )
}
