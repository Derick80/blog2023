import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { RowBox } from '~/components/boxes'
import Button from '~/components/button'
import { getUsers } from '~/server/user.server'

export async function loader({ request }: LoaderArgs) {
  const users = await getUsers()

  if (!users) {
    return { json: { message: 'No users found' } }
  }

  return json({ users })
}

export default function UsersIndex() {
  const data = useLoaderData<{
    users: {
      id: number
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
    <div className='flex flex-col items-center gap-2 md:gap-4'>
      <h1 className='text-2xl font-bold md:text-3xl'>Users</h1>
      <ul className='flex w-full flex-col items-center gap-1 md:gap-2'>
        {data.users.map((user) => (
          <li
            className='flex w-full flex-col justify-between gap-1 rounded-lg border-2 p-1 md:gap-2 md:p-2'
            key={user.id}
          >
            <RowBox>
              <img
                className='h-10 w-10 rounded-full'
                src={user.avatarUrl}
                alt={user.username}
              />
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
              <Link to={`/users/${user.username}`}>View User</Link>
            </RowBox>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  )
}
