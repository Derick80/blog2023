import type { CommentLike } from '@prisma/client'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { SerializeFrom } from '@remix-run/node'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { useOptionalUser } from '~/utilities'

export default function LikeComment({
  commentId,
  commentLikesNumber,
  likes
}: {
  commentId: string
  commentLikesNumber: number
  likes: SerializeFrom<CommentLike[]>
}) {
  const likeCommentFetcher = useFetcher()
  const user = useOptionalUser()

  const currentUser = user?.id || ''
  const userLikedComment = likes?.find(({ userId }) => {
    return userId === currentUser
  })
    ? true
    : false

  const [likeCount, setLikeCount] = React.useState(commentLikesNumber || 0)
  const [liked, setLiked] = React.useState(userLikedComment)

  const toggleLike = async () => {
    let method: FormMethod = 'delete'
    if (userLikedComment) {
      setLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      method = 'post'
      setLiked(true)
      setLikeCount(likeCount + 1)
    }

    likeCommentFetcher.submit(
      {
        userId: currentUser,
        commentId
      },
      {
        method,
        action: `/comment/${commentId}/like`
      }
    )
  }

  return (
    <>
      {user ? (
        <button onClick={toggleLike}>
          {liked ? (
            <div className='flex flex-row items-center gap-1'>
              <HeartFilledIcon style={{ color: 'red', fill: 'red' }} />
              <div className='text-[15px]'>{likeCount}</div>
            </div>
          ) : (
            <div className='flex flex-row items-center gap-1'>
              <HeartIcon />

              <div className='text-[15px]'>{likeCount}</div>
            </div>
          )}
        </button>
      ) : (
        <>
          <HeartIcon />
        </>
      )}
    </>
  )
}
