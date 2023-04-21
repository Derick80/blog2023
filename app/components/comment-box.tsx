import { Post } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
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
          className='flex flex-col gap-2 text-black'
          reloadDocument={true}
          action={`/blog/${postId}/comment`}
          method='POST'
        >
          <input type='hidden' name='postId' value={postId} />
          {parentId && <input type='hidden' name='parentId' value={parentId} />}

          <label htmlFor='message'>Comment</label>
          <textarea
            id='message'
            name='message'
            className='text-slate12 block w-full rounded-xl border-2 p-2 text-sm'
          />
          <button type='submit'>
            {parentId ? 'Post reply' : 'Post a comment'}
          </button>
        </commentFetcher.Form>
      )}
    </div>
  )
}
