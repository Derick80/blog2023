import React from 'react'
import { RowBox } from './boxes'
import { Form, useActionData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import Button from './button'
import type { Vote } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

// these types worked
type SerialzedVote = SerializeFrom<Vote[]>
type Optional = {
  id: string
  value: string
  votes: SerialzedVote
}

export type VotingMachineProps = {
  initVoteTotal: number
  options: Optional[]

  votes: SerializeFrom<Vote[]>
  title: string
  description: string
  pollId: string
}

export default function VotingMachine({
  initVoteTotal,
  options,
  votes,
  title,
  description,
  pollId
}: VotingMachineProps) {
  const actionData = useActionData()
  const [hasVoted, setHasVoted] = React.useState(false)
  const votedUsers = votes.map((vote) => vote.userId)
  const currentUser = useOptionalUser()

  const currentUserId = currentUser?.id

  const userVoted = votedUsers.includes(currentUserId as string)

  const [voteTotal, setVoteTotal] = React.useState<number>(initVoteTotal)

  const [opts, setOptions] = React.useState(options)

  React.useEffect(() => {
    setVoteTotal(initVoteTotal)
  }, [initVoteTotal])


  const [voting, setVoting] = React.useState(false)
  return (
    <>
      <div className='flex w-full flex-col flex-wrap'>
        <h3 className='text-xl'>{title}</h3>
        <p className='text-xs italic'>{description}</p>
        {options.map((option) => {
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
                        (option.votes.length / voteTotal) *
                        100
                      ).toFixed(0)}%`
                    }}
                  ></div>
                  <RowBox>
                    {option.votes.length > 0 ? (
                      <>
                        <p className='z-30 text-xs text-white'>
                          {((option.votes.length / voteTotal) * 100).toFixed(0)}
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
            <input type='hidden' name='pollId' value={pollId} />
            {options.map((option) => {
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
    </>
  )
}
