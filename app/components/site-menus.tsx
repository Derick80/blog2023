import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { NavLink } from '@remix-run/react'
import React from 'react'

export type MenuBoxProps = {
  title: string
}
export default function MenuBox({ title }: MenuBoxProps) {
  const [menu, setMenu] = React.useState(false)
  return (
    <div className='flex flex-col'>
      <div className='flex w-full items-center'>
        <h6 className='text-sm font-bold'>{title}</h6>
        <button onClick={() => setMenu(!menu)}>
          {menu ? (
            <ChevronUpIcon className='text-teal-400' />
          ) : (
            <ChevronDownIcon className='text-teal-400' />
          )}
        </button>
      </div>
      {menu && (
        <div
          className='relative  flex flex-col  border-none'
          onMouseLeave={() => setMenu(!menu)}
        >
          <div className='absolute z-10 flex w-fit flex-col items-center justify-between rounded-md bg-white dark:bg-slate-900'>
            <MapMenuItems menuItems={MenuItems} setMenu={setMenu} />
          </div>
        </div>
      )}
    </div>
  )
}

export const MenuItems = [
  {
    title: 'CV',
    path: '/cv'
  },
  {
    title: 'Categories',
    path: '/categories'
  },

  {
    title: 'Users',
    path: '/users'
  },
  {
    title: 'UI',
    path: '/ui-components'
  },
  {
    title: 'Beta',
    path: '/beta'
  },
  {
    title: 'Documentation',
    path: '/documentation'
  }
]

export function MapMenuItems({
  menuItems,
  setMenu
}: {
  menuItems: typeof MenuItems
  setMenu: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <>
      {menuItems.map((item, index) => (
        <NavLink
          className='p-1 text-sm text-slate-900 dark:text-violet3'
          key={index}
          to={item.path}
          onClick={() => setMenu(false)}
        >
          {item.title}
        </NavLink>
      ))}
    </>
  )
}
