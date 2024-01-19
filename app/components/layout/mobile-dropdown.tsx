import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button'
import React from 'react'
import { XSquareIcon } from 'lucide-react'
import { BrandIcon } from '~/resources/brand-icon'
import { NavLink } from '@remix-run/react'
import { ThemeToggle } from '../theme/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useOptionalUser } from '~/utilities'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import AvatarWithOptions from '../avatar-with-options'

const MobileDropdown = () => {
  const user = useOptionalUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <BrandIcon className='w-12 h-12' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='flex flex-col items-center justify-center gap-2'
        align='end'
      >
        <NavLink
          title='Navigate to the blog page to see all the blog posts'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/blog'
        >
          Blog
        </NavLink>
        <NavLink
          title='Navigate to the about page to learn more about me'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/about'
        >
          About
        </NavLink>
        <NavLink
          title='Navigate to the CV page to see my CV'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/cv'
        >
          CV
        </NavLink>
        <NavLink
          title='Navigate to the projects page to see my projects'
          className={({ isActive, isPending }) => {
            return isActive ? 'underline' : ''
          }}
          to='/projects'
        >
          Projects
        </NavLink>

        <div className='flex flex-row items-center justify-center gap-2'>
          <ThemeToggle />
          {user ? <AvatarWithOptions user={user} /> : null}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileDropdown
