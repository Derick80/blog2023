import { NavLink } from '@remix-run/react'
import { BrandIcon } from '~/resources/brand-icon'
import { useOptionalUser } from '~/utilities'
import { ThemeToggle } from '../theme/theme-toggle'
import MobileDropdown from './mobile-dropdown'
import DesktopMenu from './desktop-menu'
import AvatarWithOptions from '../avatar-with-options'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger
} from '../ui/navigation-menu'
// sticky top-0 z-50 flex w-full flex-row items-center justify-around bg-slate-50 dark:bg-slate-800
export default function NavigationBar() {
  return (
    <nav className='bg-background relative w-full border-b md:border-0 flex flex-col md:flex-row items-center justify-between'>
      <DesktopBrandIcon />
      <div className='flex flex-row items-center justify-center md:justify-around gap-2 w-full '>
        <DesktopMenu />
        <MobileDropdown />
        <UserMenu />
        <ThemeToggle />
      </div>
    </nav>
  )
}

function UserMenu() {
  const user = useOptionalUser()
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {user ? 'Account' : 'Join'}
          </NavigationMenuTrigger>
          <NavigationMenuContent asChild>
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col'>
              {user ? (
                <>
                  <li>
                    <AvatarWithOptions user={user} />
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to='/login'
                    title='Click here to login to your account'
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function DesktopBrandIcon() {
  return (
    <NavLink
      title='Click on the Brand Icon to go to the home page'
      to='/'
      className='flex md:flex flex-row items-center justify-center gap-2'
    >
      <BrandIcon className='hidden md:block' />
      <span className='text-xl font-bold'>DerickCHoskinson.com</span>
    </NavLink>
  )
}
