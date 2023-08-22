import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher, useMatches } from '@remix-run/react'
import React, { useState } from 'react'
import type { Like } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
export type LikeContainerProps = {
  postId: string
}

export default function LikeContainer({ postId }: LikeContainerProps) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''

  const fetcher = useFetcher()
  // get the matches from the route loader data
  const matches = useMatches()

  const postLikes = matches
    .find(({ data }) => {
      return data.posts
    })
    ?.data.posts.filter(({ id }: { id: string }) => {
      return id === postId
    })
    .map(({ likes }: { likes: Like[] }) => {
      return likes
    })
    .flat() as Like[] | undefined

  const postLikesCount = postLikes?.length || 0
  const userLikedPost = postLikes?.find(({ userId }) => {
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
