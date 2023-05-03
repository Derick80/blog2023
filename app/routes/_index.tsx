import { V2_MetaFunction, useLoaderData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import VotingMachine from '~/components/voting-machine'
import { ColBox, RowBox } from '~/components/boxes'
import {
  commitSession,
  getSession,
  setErrorMessage
} from '~/server/auth/session.server'
export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'A new Remix app' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
}

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const latestPoll = await prisma.poll.findFirst({
    include: {
      options: {
        include: {
          votes: true
        }
      },
      votes: {
        include: {
          option: true
        }
      }
    }
  })
  if (!latestPoll) {
    setErrorMessage(session, 'No polls found')
    return {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  } else {
    return json({ latestPoll })
  }
}

export default function Index() {
  const data = useLoaderData<{
    latestPoll: {
      id: string
      completed: boolean
      description: string
      createdAt: string
      title: string
      updatedAt: string
      options: {
        id: string
        createdAt: string
        updatedAt: string
        pollId: string

        value: string
        votes: {
          id: string
          createdAt: string
          updatedAt: string
          optionId: string
          userId: string
        }
      }
      votes: {
        id: string
        createdAt: string
        updatedAt: string
        optionId: string
        userId: string
      }[]
    }
  }>()
  console.log(data, 'data')

  const initialVotes = data.latestPoll?.votes?.length || 0

  const user = useOptionalUser()
  return (
    <div className='flex flex-col'>
      <h1>Welcome to My Social Media App</h1>
      <ColBox>
        <h3 className='text-center'>Latest Poll</h3>
        <VotingMachine poll={data?.latestPoll} initVoteTotal={initialVotes} />
      </ColBox>
      <ul>
        {user && (
          <li>
            <div className='flex flex-row'>
              <p>{user.email}</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}
