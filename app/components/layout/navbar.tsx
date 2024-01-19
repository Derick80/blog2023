import { NavLink } from '@remix-run/react'
import { BrandIcon } from '~/resources/brand-icon'
import { useOptionalUser } from '~/utilities'
import { ThemeToggle } from '../theme/theme-toggle'
import MobileDropdown from './mobile-dropdown'
// sticky top-0 z-50 flex w-full flex-row items-center justify-around bg-slate-50 dark:bg-slate-800
export default function NavigationBar () {
  const user = useOptionalUser()

  // fix w-4/s6 if I want to change the latout
  return (
    <nav className='bg-accent w-full border-b md:border-0 flex items-center flex-col'>
      <DesktopBrandIcon />
      <MobileDropdown />
      <LocationBar />
    </nav>
  )
}

function LocationBar () {

  return (
    <div className='flex flex-row items-center justify-center gap-2 w-full border border-red-300'>

    </div>
  )


}


function DesktopBrandIcon () {
  return (
    <NavLink
      title='Click on the Brand Icon to go to the home page'
      to='/'
      className='hidden md:flex flex-row items-center justify-center gap-2'
    >
      <BrandIcon className='w-4 h-4' />
      <span className='text-xl font-bold'>DerickCHoskinson.com</span>
    </NavLink>
  )
}

const moreMenuItems = [
  {
    label: 'CV',
    title: 'View my CV',
    path: '/cv'
  },
  {
    label: 'Categories',
    title: 'View the blog categories',
    path: '/categories'
  },

  {
    label: 'Users',
    title: 'View the users',
    path: '/users'
  },
  {
    label: 'UI',
    title: 'View the UI components',
    path: '/ui-components'
  },

  {
    label: 'Documentation',
    title: 'View the documentation',
    path: '/documentation'
  }
]
