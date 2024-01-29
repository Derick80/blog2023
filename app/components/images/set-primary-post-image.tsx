import { useFetcher } from '@remix-run/react'
import { Button } from '../ui/button'

export const SetPrimaryPostImage = ({
  imageUrl,
  postId,
  primaryPostImage
}: {
  imageUrl: string
  postId: string
  primaryPostImage?: string
}) => {
  const isAlreadyPrimary =
    primaryPostImage === undefined || primaryPostImage !== imageUrl
      ? false
      : true
  const updatePrimaryImageFetcher = useFetcher()

  return (
    <updatePrimaryImageFetcher.Form
      method='POST'
      action={`/blog/admin/${postId}`}
    >
      <input type='hidden' name='imageUrl' value={imageUrl} />
      <input type='hidden' name='postId' value={postId} />
      <Button
        type='submit'
        className='absolute top-0 left-0  p-1 text-xs'
        variant='ghost'
        aria-label='Set as primary image'
        name='intent'
        value='setPrimaryImage'
      >
        {isAlreadyPrimary ? ' ⭐️ ' : '⬆️'}
      </Button>
    </updatePrimaryImageFetcher.Form>
  )
}
