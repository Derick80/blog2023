import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import type { Favorite } from '~/server/schemas/schemas'
import { useOptionalUser } from '~/utilities'
import Button from './button'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Favorite_v2 } from '~/server/schemas/schemas_v2'

export type FavoriteContainerProps = {
  postId: string
  favorites: Favorite_v2[]
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
      <Button
        variant='icon_unfilled'
        size='tiny'
        className=''
        onClick={toggleFavorite}
      >
        {isFavorite ? (
          <BookmarkFilledIcon style={{ color: 'red', fill: 'red' }} />
        ) : (
          <BookmarkIcon className='text-violet-900 dark:text-violet3' />
        )}
      </Button>
    </>
  )
}
