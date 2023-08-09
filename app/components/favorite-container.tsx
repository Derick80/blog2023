import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Favorite } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import Button from './v3-components/button'
import * as Tooltip from '@radix-ui/react-tooltip'

export type FavoriteContainerProps = {
  postId: string
  favorites: Favorite[]
}

export default function FavoriteContainer({
  postId,
  favorites
}: FavoriteContainerProps) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''
  console.log(currentUser, 'current user')

  const fetcher = useFetcher()
  const userFavoritedPost = favorites?.find(
    ({ userId }) => userId === currentUser
  )
    ? true
    : false

  const [isFavorite, setIsFavorite] = useState(userFavoritedPost)

  const toggleFavorite = async () => {
    let method: FormMethod = 'delete'
    if (userFavoritedPost) {
      setIsFavorite(false)
    } else {
      method = 'post'
      setIsFavorite(true)
    }

    fetcher.submit(
      { userId: currentUser, postId },
      { method, action: `/blog/${postId}/favorite` }
    )
  }

  return (
    <>
      {currentUser ? (
        <Button
          variant='ghost'
          size='tiny'
          className=''
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <BookmarkFilledIcon style={{ color: 'red', fill: 'red' }} />
          ) : (
            <BookmarkIcon className='text-black' />
          )}
        </Button>
      ) : (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className=''>
                <BookmarkIcon />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]'
                sideOffset={5}
              >
                Sign in to favorite this post
                <Tooltip.Arrow className='fill-white' />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </>
  )
}
