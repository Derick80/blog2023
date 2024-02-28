import { CopyIcon } from '@radix-ui/react-icons'
import React from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export const CopyCloudinaryUrl = ({ imageUrl }: { imageUrl: string }) => {
  const ref = React.useRef<HTMLInputElement | null>(null)
  const copiedImageUrl = imageUrl

  const copyLink = () => {
    ref.current?.select()
    ref.current?.setSelectionRange(0, 99999)
    navigator?.clipboard?.writeText(copiedImageUrl)
    toast('📝 Copied to Clipboard', {
      style: {
        background: 'green'
      }
    })
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type='button' variant='ghost' size='default'>
          <CopyIcon className='text-primary md:size-6 size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='center' className='w-[250px] md:w-[520px]'>
        <div className='flex flex-col space-y-2 text-center sm:text-left'>
          <h3>Copy Image URL</h3>
        </div>
        <input
          id='link'
          className='text'
          ref={ref}
          defaultValue={copiedImageUrl}
          readOnly
        />
        <Button
          className='absolute bottom-0 left-0 p-2'
          type='button'
          variant='ghost'
          aria-label='Copy image url'
          onClick={copyLink}
        >
          <CopyIcon className='block h-3 w-3' />
        </Button>
      </PopoverContent>
    </Popover>

  )
}
