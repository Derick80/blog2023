import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUsers } from '~/.server/user.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
    const users = await getUsers()
    if (!users) throw new Error('No users found')

    return json({ users })
}

export default function UsersRoute() {
    const { users } = useLoaderData<typeof loader>()

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    )
}
