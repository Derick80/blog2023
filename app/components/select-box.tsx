import React from 'react'

interface Option {
  value: string
  id: string
}

interface MultiSelectProps {
  options: Option[]
  onChange: (selected: Option[]) => void
}

export default function SelectBox({ options, onChange }: MultiSelectProps) {
  const [selected, setSelected] = React.useState<Option[]>([])

  const handleOptionClick = (option: Option) => {
    if (selected.some((o) => o.value === option.value)) {
      setSelected(selected.filter((o) => o.value !== option.value))
    } else {
      setSelected([...selected, option])
    }
  }

  React.useEffect(() => {
    onChange(selected)
  }, [selected, onChange])

  return (
    <div>
      {options.map((option) => (
        <label key={option.id}>
          <input
            name='categories'
            value={option.value}
            type='checkbox'
            checked={selected.some((o) => o.value === option.value)}
            onChange={() => handleOptionClick(option)}
          />
          {option.value}
        </label>
      ))}
    </div>
  )
}
