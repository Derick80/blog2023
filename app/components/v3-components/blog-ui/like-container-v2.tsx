import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Like_v2 } from '~/server/schemas/schemas_v2'
import { useOptionalUser } from '~/utilities'
export type LikeContainerProps = {
  postId: string
  likes: Like_v2[]
}

export default function LikeContainer({ postId, likes }: LikeContainerProps) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''
  const fetcher = useFetcher()

  const postLikesCount = likes?.length
  const userLikedPost = likes?.find(({ userId }: { userId: string }) => {
    return userId === currentUser
  })
    ? true
    : false

  const [likeCount, setLikeCount] = useState(postLikesCount)
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
      <button disabled={!user} className='text-black' onClick={toggleLike}>
        <div className='flex flex-row items-center gap-1'>
          {isLiked ? (
            <HeartFilledIcon style={{ color: 'red', fill: 'red' }} />
          ) : (
            <HeartIcon className='text-black dark:text-slate-50' />
          )}
          <p className='text-[15px] dark:text-slate-50'>{likeCount}</p>
        </div>
      </button>
    </>
  )
}
