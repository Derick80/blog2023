import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'

interface CboxProps {
  selected: boolean
  tag: string
  onClick?: () => void
  disabled?: boolean

  name: string
}

export default function CustomCheckbox({
  selected,
  tag,
  onClick,
  disabled,
  name
}: CboxProps) {
  return (
    <Checkbox.Root
      checked={selected}
      disabled={disabled}
      onCheckedChange={onClick}
      name={name}
      value={tag}
      className={clsx(
        'relative mb-2 md:mb-4 mr-2 md:mr-4 text-xs md:text-base w-auto cursor-pointer rounded-full px-4 py-2 transition',
        {
          'text-primary  bg-secondary': !selected,
          'text-inverse bg-inverse': selected,
          'focus-ring opacity-100': !disabled,
          'opacity-25': disabled
        }
      )}
    >
      {tag}
    </Checkbox.Root>
  )
}
