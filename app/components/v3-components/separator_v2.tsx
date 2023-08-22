import * as Separator from '@radix-ui/react-separator'
import clsx from 'clsx'

// this is kind of a hacky way to do this, but it works for now
// for some reason the different tailwind weights are not being applied to every color?

export default function SeparatorV2({
  orientation,
  color,
  className
}: {
  orientation: 'horizontal' | 'vertical'
  color: string
  className?: string
}) {
  return (
    <Separator.Root
      className={clsx(
        `mt-[15px] data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px`,
        `bg-${color}`,
        `${className}`
      )}
    />
  )
}
