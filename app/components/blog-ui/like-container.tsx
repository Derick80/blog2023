import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { ThumbsUpIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Like } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import { Muted } from '../ui/typography'
export type LikeContainerProps = {
  postId: string
  likes: Pick<Like, 'userId' | 'postId'>[]
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
    <Button
      variant='ghost'
      size='default'
      disabled={!user}
      onClick={toggleLike}
    >
      {isLiked ? (
        <ThumbsUpIcon
          className='text-primary md:size-6 size-4'
          style={{ fill: 'currentColor' }}
        />
      ) : (
        <ThumbsUpIcon className='text-primary md:size-6 size-4' />
      )}
      <Muted className='relative top-1'>{likeCount}</Muted>
    </Button>
  )
}
// had to change bottom-1 to top-1 because the icon was moving down instead of up
