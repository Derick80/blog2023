import { CopyIcon } from '@radix-ui/react-icons'
import React from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

export const CopyCloudinaryUrl = ({ imageUrl }: { imageUrl: string }) => {
  const ref = React.useRef<HTMLInputElement | null>(null)
  const copiedImageUrl = imageUrl
  const encodedImageUrl = encodeURIComponent(copiedImageUrl)

  const copyLink = () => {
    ref.current?.select()
    ref.current?.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copiedImageUrl)
    toast('📝 Copied to Clipboard', {
      style: {
        background: 'green'
      }
    })
  }

  return (
    <div>
      <input className='hidden' ref={ref} value={copiedImageUrl} readOnly />
      <Button
        className='absolute bottom-0 left-0 bg-green-500 text-white p-1 text-xs'
        type='button'
        aria-label='Copy image url'
        onClick={copyLink}
      >
        Copy Image Url
      </Button>
    </div>
  )
}
