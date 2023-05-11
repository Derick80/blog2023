import type { V2_MetaFunction} from '@remix-run/react';
import { useLoaderData, useNavigation } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import VotingMachine from '~/components/voting-machine'
import { ColBox } from '~/components/boxes'
export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'A new Remix app' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
}

export async function loader({ request }: LoaderArgs) {
const data = await prisma.poll.findFirst({
    include: {
      votes: true,
      _count: {
        select: { votes: true,
        options: true }
      },

      options: {
        include: {
          votes: true,
          _count: {
            select: { votes: true }
          }
        }
      },
      
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!data) {
   throw new Error('No data found')
  }

  return json({ data })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  console.log(data, 'data');

  const votes = data.data._count
  console.log(votes, 'votes');
  
  const initialVotes = votes.votes
  console.log(initialVotes, 'initialVotes');
  

  const navigate = useNavigation()
  const user = useOptionalUser()
  return (
    <div
      className={
        navigate.state === 'loading'
          ? 'opacity-25 transition-opacity delay-200'
          : 'flex flex-col'
      }
    >
      <h1>Welcome to My Social Media App</h1>
      <ColBox>
        <h3 className='text-center'>Latest Poll</h3>
      <VotingMachine initVoteTotal={initialVotes || 0}
        pollId={data.data.id}
      options={data.data.options}
        title={data.data.title}
        description={data.data?.description}
      votes={data.data.votes}/>
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
