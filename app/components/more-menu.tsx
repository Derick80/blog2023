import { NavLink } from '@remix-run/react'
import { useId } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '~/components/ui/navigation-menu'

type MenuBarProps = {
  title: string
  menuItems: {
    label?: string
    path: string
    icon?: React.ReactNode
  }[]
}

const MenuBar = ({ title, menuItems }: MenuBarProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              {menuItems.map((item) => (
                <li className='row-span-3' key={item.path}>
                  <NavigationMenuLink
                    asChild
                    className='flex flex-row items-center gap-2'
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive, isPending }) => {
                        return isActive ? 'underline' : ''
                      }}
                    >
                      <p className='text-base font-semibold'>{item.label}</p>
                      {item.icon ? item.icon : null}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default MenuBar
