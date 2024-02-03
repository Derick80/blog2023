import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { useOptionalUser } from '~/utilities'
import type { Favorite } from '~/server/schemas/schemas'
import { Button } from '../../ui/button'

export type FavoriteContainerProps = {
  postId: string
  favorites: Pick<Favorite, 'userId' | 'postId'>[]
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
    <Button
      variant='ghost'
      size='default'
      onClick={toggleFavorite}
      disabled={!user}
    >
      {isFavorite ? (
        <BookmarkFilledIcon
          className='text-primary md:size-6 size-4'
          style={{ fill: 'currentColor' }}
        />
      ) : (
        <BookmarkIcon className='text-primary md:size-6 size-4' />
      )}
    </Button>
  )
}
