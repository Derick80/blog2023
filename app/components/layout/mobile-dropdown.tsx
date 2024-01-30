import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink} from '../ui/navigation-menu'
import { BrandIcon } from '~/resources/brand-icon'
import { NavLink } from '@remix-run/react'
import { menuItems } from './desktop-menu'

const MobileDropdown = () => {
  return (
    <NavigationMenu className='flex md:hidden'>
      <NavigationMenuList className='flex justify-between'>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink to='/' title='Click to go to the home page'>
              <BrandIcon />
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3'>
              {menuItems.map((item, index) => {
                return (
                  <li key={index}>
                    <NavigationMenuLink asChild>
                      <NavLink to={item.path} title={item.title}>
                        {item.label}
                      </NavLink>
                    </NavigationMenuLink>
                  </li>
                )
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default MobileDropdown
