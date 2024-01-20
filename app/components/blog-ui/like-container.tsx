import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import type { Like_v2 } from '~/server/schemas/schemas_v2'
import { useOptionalUser } from '~/utilities'
export type LikeContainerProps = {
  postId: string
  likes: Like_v2[]
}

export default function LikeContainer ({ postId, likes }: LikeContainerProps) {
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

    <Button variant='ghost' size='icon' disabled={ !user } onClick={ toggleLike }>
      { isLiked ? (
        <HeartFilledIcon className='border-2 border-muted bg-popover' style={ {
          color: 'red',
          fill: 'red'

        } } />
      ) : (
        <HeartIcon className='border-2 border-muted bg-popover' />
      ) }
      <span className="relative top-1 text-xs">{ likeCount }</span>
    </Button>

  )
}
// had to change bottom-1 to top-1 because the icon was moving down instead of up