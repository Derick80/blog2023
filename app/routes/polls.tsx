import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData
} from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import React from 'react'
import { RowBox } from '~/components/boxes'
import VotingMachine from '~/components/voting-machine'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import { z } from 'zod'
import { validateAction } from '~/utilities'
export async function loader({ request, params }: LoaderArgs) {
  const polls = await prisma.poll.findMany({
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

  return json({ polls })
}

export const schema = z.object({
  option: z.string().min(1).max(100),
  pollId: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request, params }: ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  const { formData, errors } = await validateAction({ request, schema })

  if (errors) {
    return json({ errors }, { status: 400 })
  }

  const { option, pollId } = formData as ActionInput

  const votedAlready = await prisma.vote.findFirst({
    where: {
      pollId: pollId as string,
      userId: user?.id as string
    },
    include: {
      option: {
        include: {
          poll: true
        }
      }
    }
  })

  if (votedAlready) {
    const updated = await prisma.vote.update({
      where: {
        id: votedAlready.id
      },
      data: {
        optionId: option as string
      },
      include: {
        option: {
          include: {
            poll: true
          }
        }
      }
    })
    if (!updated) {
      setErrorMessage(session, 'You must be logged in to vote')
    } else {
      setSuccessMessage(session, `You have voted for ${updated.option.value}`)
    }
    return redirect('/polls', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  const voted = await prisma.vote.create({
    data: {
      optionId: option as string,
      pollId: pollId as string,
      userId: user?.id as string
    }
  })
  if (!voted) {
    setErrorMessage(session, 'You must be logged in to vote')
  } else {
    setSuccessMessage(session, 'You have already voted')
  }

  return redirect('/polls', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}
export default function () {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  React.useEffect(() => {
    setVoteTotal(Number(data.polls[0].votes.length))
  }, [data.polls])

  const [voteTotal, setVoteTotal] = React.useState<number>(
    Number(data.polls[0].votes.length)
  )
  return (
    <div className='flex flex-col gap-1'>
      <h1 className=''>
        <Link to='/polls'>Polls</Link>
        <Link to='/polls/new'>New Poll</Link>
      </h1>

      {data.polls.map((poll) => (
        <VotingMachine
          key={poll.id}
          initVoteTotal={poll.votes.length}
          poll={poll}
        />
      ))}

      <Outlet />
      {/* <pre>
  {JSON.stringify(data, null, 2)}
</pre> */}
    </div>
  )
}
