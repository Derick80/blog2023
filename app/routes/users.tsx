import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { ColBox, RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { getUsers } from '~/server/user.server'
import { useOptionalUser } from '~/utilities'

export async function loader({ request }: LoaderArgs) {
  const users = await getUsers()

  if (!users) {
    return { json: { message: 'No users found' } }
  }

  return json({ users })
}

export default function UsersIndex() {
  const user = useOptionalUser()
  const userId = user?.id
  const data = useLoaderData<{
    users: {
      id: string
      username: string
      email: string
      avatarUrl: string
      _count: {
        posts: number
        comments: number
        likes: number
        favorites: number
      }
    }[]
  }>()

  return (
    <div className='mx-auto flex flex-row items-center gap-2 md:gap-4'>
      <ColBox>
        <h1 className='text-2xl font-bold md:text-3xl'>Users</h1>
        <ul className='flex w-full flex-col items-center gap-1 md:gap-2'>
          {data.users.map((user) => (
            <li
              className='flex w-full flex-col justify-between gap-1 rounded-lg border-2 p-1 md:gap-2 md:p-2'
              key={user.id}
            >
              <RowBox>
                {user.avatarUrl ? (<>
                  <img
                    className='h-10 w-10 rounded-full'
                    src={user.avatarUrl}
                    alt={user.username}
                  />
                   {
                   userId === user.id && (
                      <Button size='small' variant='primary_filled'>
                        <Link to={`/users/${user.username}/edit`}>
                          Edit Profile
                        </Link>
                      </Button>
                    )
                      
                  }
                  </>
                ) : (
                  <UserPlaceHolder />
                )}
               

             
                <h3 className='text-xl font-bold'>{user.username}</h3>
              </RowBox>
              <p>{user.email}</p>
              <RowBox>
                <Button size='small' variant='primary_filled'>
                  <Link to={`/blog/${user.username}`}>
                    {' '}
                    <p className='text-xs'>Posts: {user._count.posts}</p>
                  </Link>
                </Button>
                <Button size='small' variant='ghost'>
                  <Link to={`/users/${user.username}`}>View User</Link>
                </Button>
              </RowBox>
            </li>
          ))}
        </ul>
      </ColBox>
      <Outlet />
    </div>
  )
}
