import { NavLink } from '@remix-run/react'
import { BrandIcon } from '~/resources/brand-icon'
import { useOptionalUser } from '~/utilities'
import HoverOverCard from '../hovercard/hover-card'
import MenuBox from '../site-menus'
// sticky top-0 z-50 flex w-full flex-row items-center justify-around bg-slate-50 dark:bg-slate-800
export default function NavigationBar() {
  const user = useOptionalUser()
  // fix w-4/s6 if I want to change the latout
  return (
    <div className='sticky top-0 z-10 flex items-center justify-between gap-1 md:h-full md:flex-col lg:flex-row'>
      <div className='flex flex-row items-center gap-2 p-2'>
        <NavLink className='h-10 w-10' to='/'>
          <BrandIcon />
        </NavLink>
      </div>
      <div className='flex  flex-row items-center gap-2 p-2 sm:flex-row md:flex-col lg:flex-row'>
        <NavLink
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/'
        >
          <p className='text-sm font-semibold dark:text-slate-50'>Home</p>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/blog'
        >
          <p className='text-sm font-semibold dark:text-slate-50'>Blog</p>
        </NavLink>

        <NavLink
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/about'
        >
          <p className='text-sm font-semibold dark:text-slate-50'>About</p>
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/projects'
        >
          <p className='text-sm font-semibold dark:text-slate-50'>Projects</p>
        </NavLink>
        <MenuBox title='Links' />
      </div>

      {user ? (
        <div className='flex flex-row items-center gap-2 p-2'>
          <HoverOverCard />
        </div>
      ) : (
        <NavLink to='/login'>
          <p className='text-sm font-semibold dark:text-slate-50'>Login</p>
        </NavLink>
      )}
    </div>
  )
}
