import {
  ArrowUpIcon,
  ExitIcon,
  GitHubLogoIcon,
  HomeIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon
} from '@radix-ui/react-icons'
import { ColBox } from './boxes'
import { Form, Link, NavLink } from '@remix-run/react'
import Button from './button'
import { useOptionalUser } from '~/utilities'
import { Affix, Transition, rem } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <div className=' '>
      <NavigationBar />

      <div className='mt-20 flex h-full flex-grow flex-col p-2 md:mt-12 md:flex-row'>
        <LeftNavigationBar />
        <main className='flex-grsow relative mx-auto mt-5 flex w-full flex-col p-2 md:w-4/6 md:p-4'>
          {children}
        </main>
        <RightNavigationBar />
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
      <footer className='flex flex-row items-center justify-center gap-2 p-2'>
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
      </footer>
    </div>
  )
}

function NavigationBar() {
  const user = useOptionalUser()
  // fix w-4/s6 if I want to change the latout
  return (
    <div className='md:w-4/s6 fixed left-0 right-0 top-0 z-50 mx-auto flex h-16 w-full flex-row items-baseline justify-around bg-slate-50 p-1 md:p-2'>
      <h1 className='text-2xl font-bold'>Vanished</h1>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/'
      >
        <p className='text-sm font-semibold'>Home</p>
      </NavLink>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/blog'
      >
        <p className='text-sm font-semibold'>Blog</p>
      </NavLink>

      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/about'
      >
        <p className='text-sm font-semibold'>About</p>
      </NavLink>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/projects'
      >
        <p className='text-sm font-semibold'>Projects</p>
      </NavLink>
      <div> </div>
      {/* <Switch size="md" onLabel={<SunIcon />} offLabel={<MoonIcon />} /> */}

      {user ? (
        <Form
          className='flex items-center justify-center p-1'
          method='POST'
          action='/logout'
        >
          <Button variant='danger_filled' size='base'>
            <ExitIcon />
          </Button>
        </Form>
      ) : (
        <NavLink to='/login'>
          <p className='text-sm font-semibold'>Login</p>
        </NavLink>
      )}
    </div>
  )
}

function LeftNavigationBar() {
  return (
    <div className='flex w-full flex-row items-center justify-center gap-2 p-2 md:mt-20 md:w-1/6 md:flex-col md:justify-start'>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/blog/new'
      >
        <p className='text-sm font-semibold'>New Post</p>
      </NavLink>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/drafts'
      >
        <p className='text-sm font-semibold'>Drafts</p>
      </NavLink>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/users'
      >
        <p className='text-sm font-semibold'>Users</p>
      </NavLink>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/chats'
      >
        <p className='text-sm font-semibold'>Chat</p>
      </NavLink>
      <NavLink
        to='ui-components'
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
      >
        <p className='text-sm font-semibold'>UI</p>
      </NavLink>
    </div>
  )
}
function RightNavigationBar() {
  return (
    <div className='flex w-full flex-row items-center justify-center gap-2 p-2 md:mt-20 md:w-1/6 md:flex-col md:justify-start'>
      {' '}
      <ColBox>
        I think 'ads' go here
        <HomeIcon />
        <HomeIcon />
        <HomeIcon />
      </ColBox>
    </div>
  )
}
