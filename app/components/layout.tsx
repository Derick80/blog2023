import { ArrowUpIcon, ExitIcon } from '@radix-ui/react-icons'
import { Form, NavLink } from '@remix-run/react'
import Button from './button'
import { useOptionalUser } from '~/utilities'
import { Affix, Transition, rem, Image } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { BrandIcon } from '~/resources/brand-icon'
import MenuBox from './site-menus'
import HoverOverCard from './hovercard/hover-card'
import HoverOCard from './hovercard/hover2'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <div className='flex '>
      <NavigationBar />

      <div className='mt-20 flex h-full flex-grow flex-col p-2 md:mt-12 md:flex-row'>
        <main className='mx-auto mt-5 flex w-full flex-col p-2 md:w-4/6 md:p-4'>
          {children}
        </main>
        <div>
          <Affix position={{ bottom: rem(20), right: rem(20) }}>
            <Transition transition='slide-up' mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  variant='primary_filled'
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  <ArrowUpIcon />
                  Scroll to top
                </Button>
              )}
            </Transition>
          </Affix>
        </div>
      </div>
      {/* <footer className='flex flex-row items-center justify-center gap-2 p-2'>
        <Link
          to='https://www.linkedin.com/in/dhoskinson/'
          referrerPolicy='no-referrer'
          target='_blank'
        >
          <LinkedInLogoIcon />
        </Link>
        <p className='p'>Copyrite {new Date().getFullYear()}</p>
        <Link
          referrerPolicy='no-referrer'
          target='_blank'
          to='https://www.github.com/Derick80'
        >
          <GitHubLogoIcon />
        </Link>
      </footer> */}
    </div>
  )
}

function NavigationBar() {
  const user = useOptionalUser()
  // fix w-4/s6 if I want to change the latout
  return (
    <div className='md:w-4/s6 fixed left-0 right-0 top-0 z-50 mx-auto flex h-16 w-full flex-row items-center justify-around bg-slate-50 p-1 dark:bg-slate-800 md:p-2'>
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

      {/* <Switch size="md" onLabel={<SunIcon />} offLabel={<MoonIcon />} /> */}

      {user ? (
        <div className='flex flex-row items-center gap-2 p-2'>
          <HoverOverCard />

          <Form
            className='m-0 flex items-center justify-center p-1'
            method='POST'
            action='/logout'
          >
            <Button variant='icon_unfilled' size='small'>
              <ExitIcon />
            </Button>
          </Form>
        </div>
      ) : (
        <NavLink to='/login'>
          <p className='text-sm font-semibold dark:text-slate-50'>Login</p>
        </NavLink>
      )}
    </div>
  )
}
