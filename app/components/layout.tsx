import {
  ArrowUpIcon,
  ExitIcon,
  GitHubLogoIcon,
  HomeIcon,
  LinkedInLogoIcon
} from '@radix-ui/react-icons'
import { ColBox } from './boxes'
import { Form, Link, NavLink, useFetcher } from '@remix-run/react'
import Button from './button'
import { useOptionalUser } from '~/utilities'
import { Affix, Avatar, Transition, rem } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { action } from '~/routes/actions.cloudinary'
import { BrandIcon } from '~/resources/brand-icon'
import MenuBox from './site-menus'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <div className=' '>
      <NavigationBar />

      <div className='mt-20 flex h-full flex-grow flex-col p-2 md:mt-12 md:flex-row'>
        <main className='flex-grsow relative mx-auto mt-5 flex w-full flex-col p-2 md:w-4/6 md:p-4'>
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
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/'
      >
        <p className='text-sm font-semibold dark:text-slate-50'>Home</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>Blog</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>About</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>Projects</p>
      </NavLink>
      <MenuBox title='Links' />

      {/* <Switch size="md" onLabel={<SunIcon />} offLabel={<MoonIcon />} /> */}

      {user ? (
        <div className='flex flex-row gap-2 p-2'>
          <Avatar
            src={user.avatarUrl}
            alt={user.username}
            radius='xl'
            size='sm'
          />

          <Form
            className='flex items-center justify-center p-1'
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

function LeftNavigationBar() {
  const user = useOptionalUser()
  return (
    <div className='flex w-full flex-row items-center justify-center gap-2 p-2 md:mt-20 md:w-1/6 md:flex-col md:justify-start '>
      <NavLink
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
        to='/blog/new'
      >
        <p className='text-sm font-semibold dark:text-slate-50'>New Post</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>Drafts</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>Users</p>
      </NavLink>
      <NavLink
        to='/categories'
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
      >
        <p className='text-sm font-semibold dark:text-slate-50'>Categories</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>Chat</p>
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
        <p className='text-sm font-semibold dark:text-slate-50'>UI</p>
      </NavLink>
      <NavLink
        to='/cv'
        style={({ isActive, isPending }) => {
          return {
            textDecorationLine: isActive ? 'underline' : '',
            color: isPending ? 'red' : 'black'
          }
        }}
      >
        <p className='text-sm font-semibold dark:text-slate-50'>CV</p>
      </NavLink>
      <Avatar
        size='md'
        radius='xl'
        src={user?.avatarUrl}
        alt={user?.username}
      />
    </div>
  )
}
function RightNavigationBar() {
  const messageFetcher = useFetcher<typeof action>()

  return (
    <div className='flex w-full flex-row items-center justify-center gap-2 p-2 md:mt-20 md:w-1/6 md:flex-col md:justify-start'>
      {' '}
      <ColBox>
        <Form method='POST'>
          <Button
            variant='primary_filled'
            size='base'
            type='submit'
            name='action'
            value='create-chat'
          >
            Create Chat
          </Button>
        </Form>
        <messageFetcher.Form
          method='post'
          onSubmit={(event) => {
            const form = event.currentTarget
            requestAnimationFrame(() => {
              form.reset()
            })
          }}
        >
          <input
            type='text'
            name='content'
            className='w-full rounded-xl border-2 text-black'
          />
          <Button
            variant='primary_filled'
            type='submit'
            name='action'
            value='send-message'
          >
            Send
          </Button>
        </messageFetcher.Form>
        <HomeIcon />
        <HomeIcon />
      </ColBox>
    </div>
  )
}
