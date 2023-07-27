import { NavLink } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import { BrandIcon } from '~/resources/brand-icon'
import MenuBox from './site-menus'
import HoverOverCard from './hovercard/hover-card'
import ScrollToTop from './scroll-to-top'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex w-full p-2'>
      <ScrollToTop />
      <NavigationBar />

      <div className='mt-20 flex w-full flex-col p-2 md:p-4'>{children}</div>
    </main>
  )
}

function NavigationBar() {
  const user = useOptionalUser()
  // fix w-4/s6 if I want to change the latout
  return (
    <div className='fixed left-0 right-0 top-0 z-50 mx-auto flex h-16 w-full flex-row items-center justify-around bg-slate-50 p-1 font-robo dark:bg-slate-800 md:p-2'>
      <BrandIcon />
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
