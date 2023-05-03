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

  const votes = poll?.votes?.filter((vote) => {
    return vote.userId === currentUserId
  })

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

  console.log(voteTotal, 'voteTotal')

  const [voting, setVoting] = React.useState(false)
  return (
    <div className='flex w-full flex-col flex-wrap'>
      <h3 className='text-xl'>{poll.title}</h3>
      <p className='text-xs italic'>{poll.description}</p>
      {poll.options.map((option) => {
        return (
          <div className='relative flex w-full p-1 ' key={option.id}>
            <div className='flex w-full flex-col '>
              <div className='relative flex h-full  w-full items-center justify-between bg-blue-500'>
                <p className='z-20 inline-block w-full text-xs text-white'>
                  {option.value}
                </p>
                <div
                  className='absolute z-10 flex h-full w-full items-center justify-between bg-gradient-to-r from-orange-700 to-orange-50'
                  style={{
                    width: `${(
                      (option?.votes?.length / voteTotal) *
                      100
                    ).toFixed(0)}%`
                  }}
                ></div>
                <RowBox>
                  {option.votes.length > 0 ? (
                    <>
                      <p className='z-30 text-xs text-white'>
                        {((option?.votes?.length / voteTotal) * 100).toFixed(0)}
                        %
                      </p>
                      <p className='z-30 text-xs text-white'>
                        ({option.votes.length})
                      </p>
                    </>
                  ) : (
                    <>
                      <p className='z-30 text-xs text-white'>0%</p>
                      <p className='z-30 text-xs text-white'>(0)</p>
                    </>
                  )}
                </RowBox>
              </div>
            </div>
          </div>
        )
      })}
      <div className='mx-auto flex w-1/2 p-1'>
        <Button
          variant='primary_filled'
          size='base'
          onClick={() => setVoting(!voting)}
          className='bg-blue-500'
        >
          Vote
        </Button>
      </div>
      {voting && (
        <Form method='POST' action='/polls'>
          <input type='hidden' name='pollId' value={poll.id} />
          {poll.options.map((option) => {
            return (
              <div className='flex items-center gap-1 p-1' key={option.id}>
                <input
                  type='radio'
                  name='option'
                  defaultValue={option.id}
                  value={option.id}
                />
                <label htmlFor={option.value}>{option.value}</label>

                {actionData?.errors?.option && (
                  <p id='option-error' className='text-red-500'>
                    {actionData?.errors?.option}
                  </p>
                )}
              </div>
            )
          })}
          <Button variant='primary_filled' size='base' type='submit'>
            Submit
          </Button>
        </Form>
      )}
    </div>
  )
}
