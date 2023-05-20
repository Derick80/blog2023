import { useState, useRef } from 'react'
import * as Separator from '@radix-ui/react-separator'
import {
  CopyIcon,
  DiscordLogoIcon,
  InstagramLogoIcon,
  Share1Icon,
  TwitterLogoIcon
} from '@radix-ui/react-icons'
import toast from 'react-hot-toast'
import * as Popover from '@radix-ui/react-popover'

type Props = {
  id: string
}

const iconClassName =
  'bg-slate-100 rounded-full p-3 text-slate120 transition hover:text-primary-dark hover:bg-primary-bg dark:bg-slate-600 dark:text-slate-200 dark:hover:text-primary-light border-none'

export const ShareButton = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)
  const postUrl = `https://derickchoskinson.com/blog/${id}`
  const encodedPostUrl = encodeURIComponent(postUrl)

  const copyLink = () => {
    ref.current?.select()
    ref.current?.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(postUrl)
    toast('📝 Copied to Clipboard')
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className=''
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'A Post from the Blog',
                  url: postUrl
                })
              } else {
                setIsOpen(true)
              }
            }}
          >
            <Share1Icon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className='absolute z-10 flex w-fit flex-col items-center justify-between rounded-md bg-white p-2 dark:bg-slate-900'>
            <div className='flex flex-row items-center justify-between w-full'>
              <a
                className={iconClassName}
                href={`https://www.instagram.com/sharer/sharer.php?u=${encodedPostUrl}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <InstagramLogoIcon />
              </a>
              <a
                className={iconClassName}
                href={`http://twitter.com/share?url=${encodedPostUrl}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <TwitterLogoIcon />
              </a>
              <a
                className={iconClassName}
                href={`https://discord.me/share/url?url=${encodedPostUrl}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <DiscordLogoIcon />
              </a>
            </div>
            <Separator.Root className='my-[15px] data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px'>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Or share with link
              </p>
            </Separator.Root>
            <div className='mt-2 flex w-full items-center gap-1'>
              <input
                id='share'
                type='text'
                className='text-slate120 w-full rounded-md bg-slate-100 p-3 text-xs dark:bg-slate-600 dark:text-slate-200'
                value={postUrl}
                onClick={copyLink}
                ref={ref}
                readOnly
              />
              <button
                type='button'
                className='text-blue-500'
                onClick={copyLink}
              >
                <CopyIcon />
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
