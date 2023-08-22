import * as Separator from '@radix-ui/react-separator'
import clsx from 'clsx'

// this is kind of a hacky way to do this, but it works for now
// for some reason the different tailwind weights are not being applied to every color?

export default function SeparatorV2({
  orientation,
  className
}: {
  orientation: 'horizontal' | 'vertical'
  className?: string
}) {
  return (
    <Separator.Root
      className={clsx(
        `mt-[15px] data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`,
        `bg-violet8 dark:bg-violet11j_dark`,
        `${className}`
      )}
    />
  )
}
