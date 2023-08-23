import React from 'react'
import type { User } from '~/server/schemas/schemas'
import * as HoverCard from '@radix-ui/react-hover-card'
import { Form, Link, useFetcher } from '@remix-run/react'
import { useOptionalUser, useUser } from '~/utilities'
import Button from '../button'
import { ExitIcon } from '@radix-ui/react-icons'
export type HoverCardProps = {
  user: User
}

export default function HoverOverCard() {
  const user = useUser()

  return (
    <>
      {user && (
        <HoverCard.Root openDelay={200} closeDelay={200}>
          <HoverCard.Trigger>
            <img
              src={user.avatarUrl || ''}
              alt={`${user.username}'s avatar`}
              className='h-8 w-8 rounded-full'
            />
          </HoverCard.Trigger>
          <HoverCard.Content sideOffset={5} align='center' side='top'>
            <div className='w-50 rounded-md bg-violet1 p-5 shadow-md dark:bg-violet3_dark'>
              <div className='justify-cnter flex flex-col items-center'>
                <img
                  src={user.avatarUrl || ''}
                  alt={`${user.username}'s avatar`}
                  className='h-8 w-8 rounded-full'
                />
                <Link
                  title={`Click here to view ${user.username}'s profile`}
                  to={`/users/${user.username}`}
                  className='text-lg font-semibold text-gray-800 dark:text-gray-100'
                >
                  <h6>{user.username}</h6>
                </Link>

                <p className='text- text-violet12 dark:text-violet12_dark'>
                  {user.email}
                </p>
                {user.id && (
                  <>
                    <Button size='small' variant='primary_filled'>
                      <Link
                        title='Click here to edit your user profile'
                        to={`/users/${user.username}/edit`}
                      >
                        Edit Profile
                      </Link>
                    </Button>
                    <Form
                      className='m-0 flex items-center justify-center p-1'
                      method='POST'
                      action='/logout'
                    >
                      <Button
                        title='Click here to logout of your DerickcHoskinson.com account'
                        variant='icon_unfilled'
                        size='small'
                      >
                        <ExitIcon />
                      </Button>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </HoverCard.Content>
        </HoverCard.Root>
      )}
    </>
  )
}
