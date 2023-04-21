import type { Post } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import { useOptionalUser } from '~/utilities'

export default function CommentBox({
  postId,
  parentId
}: {
  postId: Post['id']
  parentId?: string
  userId?: string
}) {
  const user = useOptionalUser()
  const commentFetcher = useFetcher()

  return (
    <div className='flex flex-col gap-2'>
      {user && (
        <commentFetcher.Form
          className='flex flex-col gap-2'
          action={`/blog/${postId}/comment`}
          method='POST'
        >
          <input type='hidden' name='postId' value={postId} />
          {parentId && <input type='hidden' name='parentId' value={parentId} />}

          <label
            className='text-sm font-medium text-gray-700 dark:text-slate-50'
            htmlFor='message'
          >
            Comment
          </label>
          <textarea
            id='message'
            name='message'
            className='block w-full rounded-xl border-2 p-2 text-sm text-black'
          />
          <Button variant='primary_filled' size='small' type='submit'>
            {parentId ? 'Post reply' : 'Post a comment'}
          </Button>
        </commentFetcher.Form>
      )}
    </div>
  )
}
