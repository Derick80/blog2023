// change fill-Rule and Clip-rule to fillRule and clipRule

import { cn } from '~/lib/utils'

export function UserPlaceHolder({ className }: { className?: string }) {
  return (
    <svg
      className={cn(
        'h-20 w-20 rounded-full bg-neutral-100 text-neutral-400',
        className
      )}
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}
