import {
  BookmarkFilledIcon,
  BookmarkIcon
} from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Favorite } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import Button from './button'

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
            <BookmarkIcon />
          )}
        </Button>
      ) : (
        
          <BookmarkIcon />
      )}
    </>
  )
}
