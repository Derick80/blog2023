import React from 'react'
import type { User } from '~/server/schemas/schemas'
import * as HoverCard from '@radix-ui/react-hover-card'
import { Form, Link, useFetcher } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import Button from '../button'
import { ExitIcon } from '@radix-ui/react-icons'
export type HoverCardProps = {
  user: User
}

export default function HoverOverCard() {
  const currentUser = useOptionalUser()
  const currentUserId = currentUser?.id
  const userFetcher = useFetcher()

  React.useEffect(() => {
    if (userFetcher.state === 'idle' && userFetcher.data === undefined) {
      userFetcher.load('/account')
    }
  }, [userFetcher])

  const loggedInUser = userFetcher.data?.user as User

  const [hover, setHover] = React.useState(false)
  return (
    <div className=''>
      {loggedInUser && (
        <HoverCard.Root openDelay={200} closeDelay={200}>
          <HoverCard.Trigger className='flex flex-col items-center'>
            <img
              src={loggedInUser.avatarUrl || ''}
              alt={loggedInUser.username}
              className='h-8 w-8 rounded-full'
            />
          </HoverCard.Trigger>
          <HoverCard.Content sideOffset={5} align='center' side='top'>
            <div className='w-50 rounded-md bg-white p-5 shadow-md dark:bg-slate-800 '>
              <div className='justify-cnter flex flex-col items-center'>
                <img
                  src={loggedInUser.avatarUrl || ''}
                  alt={loggedInUser.username}
                  className='h-8 w-8 rounded-full'
                />
                <Link
                  to={`/users/${loggedInUser.username}`}
                  className='text-lg font-semibold text-gray-800 dark:text-gray-100'
                >
                  <h3 className='text-lg font-semibold capitalize text-gray-500'>
                    {loggedInUser.username}
                  </h3>
                </Link>

                <p className='text-xs text-gray-500'>{loggedInUser.email}</p>
                {currentUserId === loggedInUser.id && (
                  <><Button size='small' variant='primary_filled'>
                    <Link to={`/users/${userFetcher.data.user.username}/edit`}>
                      Edit Profile
                    </Link>
                  </Button><Form
                    className='m-0 flex items-center justify-center p-1'
                    method='POST'
                    action='/logout'
                  >
                      <Button variant='icon_unfilled' size='small'>
                        <ExitIcon />
                      </Button>
                    </Form></>
                )}
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard.Root>
      )}
    </div>
  )
}
