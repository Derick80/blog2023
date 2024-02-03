import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { UserType } from '~/server/schemas/schemas'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { P } from './ui/typography'
import { Form, NavLink } from '@remix-run/react'
import { ExitIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'

export type AvatarWithOptionsProps = {
  user: UserType
}

const AvatarWithOptions = ({ user }: AvatarWithOptionsProps) => {
  const { username, avatarUrl } = user
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant='outline' size='icon'>
          <Avatar>
            {avatarUrl && username ? (
              <AvatarImage src={avatarUrl} alt={username} />
            ) : null}
            <AvatarFallback>
              <UserPlaceHolder />
            </AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <Form
          className='m-0 flex items-center justify-center p-1'
          method='POST'
          action='/logout'
        >
          <Button
            title='Click here to logout of your DerickcHoskinson.com account'
            variant='ghost'
            size='sm'
          >
            <P> Logout </P>
            <ExitIcon />
          </Button>
        </Form>
        {!user ? (
          <NavLink
            title='Follow this link to login to your account'
            to='/login'
            className={({ isActive }) =>
              `m-0 flex items-center justify-center p-1 ${
                isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`
            }
          >
            <P>Login</P>
          </NavLink>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  )
}

export default AvatarWithOptions
