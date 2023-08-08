import { FormMethod, useFetcher } from '@remix-run/react'
import React from 'react'
import { User } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import * as Tooltip from '@radix-ui/react-tooltip'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'

type BlogLikeContainerProps = {
  likes: number
  postId: string
}

export default function BlogLikeContainer({
  likes,
  postId
}: BlogLikeContainerProps) {
  console.log(likes, 'likes')

  const isZero = likes === 0 ? true : false
  console.log(isZero, 'isZero')

  if (isZero)
    return (
      <div className='flex w-full'>
        <p className=''>No Likes yet...</p>
      </div>
    )
  return (
    <div className='flex w-full '>
      <BlogLikeFetcherContainer postId={postId} />
    </div>
  )
}

function BlogLikeFetcherContainer({ postId }: { postId: string }) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''

  const likeFetcher = useFetcher()

  React.useEffect(() => {
    if (likeFetcher.state === 'idle' && likeFetcher.data == null) {
      likeFetcher.load(`/blog/${postId}`)
    }
  }, [likeFetcher, postId])

  const userLikedPost = likeFetcher?.data?.post.likes.filter((user: User) => {
    return user.id === currentUser
  })
    ? true
    : false

  const [likeCount, setLikeCount] = React.useState(
    likeFetcher?.data?.post.likes.length
  )
  const [isLiked, setIsLiked] = React.useState(userLikedPost)

  const handleLike = async () => {
    let method: FormMethod = 'delete'
    if (userLikedPost) {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
    } else {
      method = 'post'
      setLikeCount(likeCount + 1)
      setIsLiked(true)
    }

    likeFetcher.submit(
      { userId: currentUser, postId },
      { method, action: `/blog/${postId}/like` }
    )
  }

  return (
    <>
      {currentUser ? (
        <button className='text-back' onClick={handleLike}>
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
function parseLikeCount(likes: number) {
  if (likes === 0) {
    return <div className='ml-2'>No Likes yet...</div>
  }
  if (likes === 1) {
    return <div className='ml-2'>{likes} Like</div>
  }
  return <div className='ml-2'>{likes} Likes</div>
}
