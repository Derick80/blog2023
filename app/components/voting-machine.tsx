import React from 'react'
import { RowBox } from './boxes'
import { Form, useActionData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import Button from './button'

export type VotingMachineProps = {
  initVoteTotal: number
  poll: {
    id: string
    title: string
    description: string
    options: {
      id: string
      value: string
      votes: {
        id: string
        optionId: string
        pollId: string
        userId: string
      }[]
    }[]
    votes: {
      id: string
      optionId: string
      pollId: string
      userId: string
    }[]
  }
}

export default function VotingMachine({
  initVoteTotal,
  poll
}: VotingMachineProps) {
  const actionData = useActionData()
  const currentUser = useOptionalUser()
  const currentUserId = currentUser?.id
  const hasVoted = poll.votes.some((vote) => {
    return vote.userId === currentUserId
  })
  console.log(hasVoted, 'hasVoted')

  const votes = poll.votes.filter((vote) => {
    return vote.userId === currentUserId
  })
  console.log(votes, 'votes')

  const [voteTotal, setVoteTotal] = React.useState<number>(initVoteTotal)
  const [options, setOptions] = React.useState(
    poll.options.map((option) => {
      return {
        ...option,
        votes: option.votes.filter((vote) => {
          return vote.userId === currentUserId
        })
      }
    })
  )
  console.log(options, 'options')

  const [vote, setVote] = React.useState<{
    id: string
    optionId: string
    pollId: string
    userId: string
  } | null>(null)

  React.useEffect(() => {
    setVoteTotal(initVoteTotal)
  }, [initVoteTotal])

  return (
    <div className='flex flex-col flex-wrap border-2'>
      <h3 className='text-xl'>{poll.title}</h3>
      <p className='text-xs italic'>{poll.description}</p>
      {poll.options.map((option) => {
        return (
          <div className='' key={option.id}>
            <div className='flex flex-col flex-wrap bg-red-100'>
              <div
                className='flex h-full items-center justify-between bg-green-500'
                style={{
                  width: `${((option.votes.length / voteTotal) * 100).toFixed(
                    0
                  )}%`
                }}
              >
                <p>{option.value}</p>

                <RowBox>
                  {
                    option.votes.length > 0 ? (
                        <><p>{((option.votes.length / voteTotal) * 100).toFixed(0)}%</p><p>({option.votes.length})</p></>
                    ) : null
                    
                  }
                </RowBox>
              </div>
            </div>
          </div>
        )
      })}
      <Form method='POST' action='/polls'>
        <input type='hidden' name='pollId' value={poll.id} />
        {poll.options.map((option) => {
          return (
            <div className='' key={option.id}>
              <label htmlFor={option.value}>{option.value}</label>
              <input
                type='radio'
                name='option'
                defaultValue={option.id}
                value={option.id}
              />
              {actionData?.errors?.option && (
                <p id='option-error' className='text-red-500'>
                  {actionData?.errors?.option}
                </p>
              )}
            </div>
          )
        })}
          <Button 
          variant='primary_filled'
          size='base'
        type='submit'>Submit</Button>
      </Form>
    </div>
  )
}
