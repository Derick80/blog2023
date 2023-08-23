import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import Button from '~/components/button'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import type { UserType } from '~/server/schemas/schemas'
import { getUsers } from '~/server/user.server'
import { useOptionalUser } from '~/utilities'
export const meta: V2_MetaFunction = () => {
  return [
    {
      title: `https://derickchoskinson.com Users`
    },
    {
      name: 'description',
      content: `https://derickchoskinson.com Users`
    }
  ]
}
export async function loader({ request }: LoaderArgs) {
  const users = await getUsers()

  if (!users) {
    return { json: { message: 'No users found' } }
  }

  return json({ users })
}

export default function UsersIndex() {
  const data = useLoaderData<{ users: UserType[] }>()
  const user = useOptionalUser()
  const userId = user?.id
  return (
    <div className='flex w-full flex-col items-center'>
      <h1>Users</h1>
      <ul className='m-0 flex w-full list-none flex-col items-center gap-1 p-0 md:gap-2'>
        {data.users.map((user) => (
          <li
            className='flex w-full flex-col justify-between gap-1 rounded-lg border-2 p-1 md:gap-2 md:p-2'
            key={user.id}
          >
            <div className='flex flex-row items-center gap-1 md:gap-2'>
              {user.avatarUrl ? (
                <>
                  <img
                    className='h-10 w-10 rounded-full'
                    src={user.avatarUrl}
                    alt={user.username}
                  />
                </>
              ) : (
                <UserPlaceHolder />
              )}

              <h3 className='text-xl font-bold'>{user.username}</h3>
            </div>
            <p>{user.email}</p>
            <div className='flex flex-row items-center gap-1 md:gap-2'>
              <Button size='small' variant='primary_filled'>
                <Link to={`/blog/users/${user.username}`}>
                  <p className='text-xs'>Posts: {user._count.posts}</p>
                </Link>
              </Button>
              <Button size='small' variant='ghost'>
                <Link to={`/users/${user.username}`}>View User</Link>
              </Button>
              {userId === user.id && (
                <Button size='small' variant='primary_filled'>
                  <Link to={`/users/${user.username}/edit`}>Edit Profile</Link>
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  )
}
