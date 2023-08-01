import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Like } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import * as Tooltip from '@radix-ui/react-tooltip'
export type LikeContainerProps = {
  likes: Like[]
  postId: string
}

export default function LikeContainer({
  likes,

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

  const [likeCount, setLikeCount] = useState(likes.length || 0)
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
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className='flex items-center gap-1 md:gap-2'>
                  <HeartIcon />
                  <p className='text-[15px]'>{likeCount}</p>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                  sideOffset={5}
                >
                  Sign in to like this post
                  <Tooltip.Arrow className='fill-white' />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </>
      )}
    </>
  )
}
