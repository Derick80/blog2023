import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Like } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'

export type LikeContainerProps = {
  likes: Like[]
  likeCounts: number
  postId: string
}

export default function LikeContainer({
  likes,
  likeCounts,
  postId
}: LikeContainerProps) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''
  const fetcher = useFetcher()
  const userLikedPost = likes?.find(({ userId }) => {
    return userId === currentUser
  })
    ? true
    : false

  const [likeCount, setLikeCount] = useState(likeCounts || 0)
  const [isLiked, setIsLiked] = useState(userLikedPost)

  const toggleLike = async () => {
    let method: FormMethod = 'delete'
    if (userLikedPost) {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
    } else {
      method = 'post'
      setLikeCount(likeCount + 1)
      setIsLiked(true)
    }

    fetcher.submit(
      { userId: currentUser, postId },
      { method, action: `/blog/${postId}/like` }
    )
  }

  return (
    <>
      {currentUser ? (
        <button className='text-black' onClick={toggleLike}>
          {isLiked ? (
            <div className='flex flex-row items-center gap-1'>
              <HeartFilledIcon style={{ color: 'red', fill: 'red' }} />
              <p className='text-[15px]'>{likeCount}</p>
            </div>
          ) : (
            <div className='flex flex-row items-center gap-1'>
              <HeartIcon />
              <p className='text-[15px]'>{likeCount}</p>
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
