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
    <div className='sticky top-0 z-10 flex items-center justify-between gap-1 bg-violet3 dark:bg-violet2_dark  md:flex-col lg:flex-row'>
      <div className='flex flex-row items-center gap-2 p-2'>
        <NavLink
          title='Click on the Brand Icon to go to the home page'
          className='h-10 w-10'
          to='/'
        >
          <BrandIcon />
        </NavLink>
      </div>
      <div className='flex w-full md:h-full  flex-row items-center justify-between gap-2 p-2 sm:flex-row md:flex-col lg:flex-row'>
        <NavLink
          title='Go to the home page'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/'
        >
          <p className='text-sm font-semibold dark:text-violet3'>Home</p>
        </NavLink>
        <NavLink
          title='Click here to go to the blog page'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/blog'
        >
          <p className='text-sm font-semibold dark:text-violet3'>Blog</p>
        </NavLink>

        <NavLink
          title='Navigate to the about page to learn more about me'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/about'
        >
          <p className='text-sm font-semibold dark:text-violet3'>About</p>
        </NavLink>
        <NavLink
          title='Navigate to the projects page to see my web development projects'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/projects'
        >
          <p className='text-sm font-semibold dark:text-violet3'>Projects</p>
        </NavLink>
        <MenuBox title='Links' />
      </div>

      {user ? (
        <div className='flex flex-row items-center gap-2 p-2'>
          <HoverOverCard />
        </div>
      ) : (
        <NavLink title='Follow this link to login to your account' to='/login'>
          <p className='text-sm font-semibold dark:text-violet3'>Login</p>
        </NavLink>
      )}
    </div>
  )
}
