import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons'
import type { FormMethod } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { useOptionalUser } from '~/utilities'
import type { Favorite_v2 } from '~/server/schemas/schemas_v2'
import { Button } from '../ui/button'


export type FavoriteContainerProps = {
  postId: string
  favorites: Favorite_v2[]
}

export default function FavoriteContainer ({
  postId,
  favorites
}: FavoriteContainerProps) {
  const user = useOptionalUser()
  const currentUser = user?.id || ''
  const isLogged = user ? true : false

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
        variant='ghost'
        size='icon'
        className=''
        onClick={ toggleFavorite }
        disabled={ !isLogged }
      >
        { isFavorite ? (
          <BookmarkFilledIcon style={ { color: 'red', fill: 'red' } } />
        ) : (
          <BookmarkIcon className='text-violet-900 dark:text-violet3' />
        ) }
      </Button>
    </>
  )
}
