import * as Checkbox from '@radix-ui/react-checkbox'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
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
        'relative mb-4 mr-4  h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition',
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
