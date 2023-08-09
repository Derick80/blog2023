import type { Post } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import Button from '~/components/v3-components/button'
import { useOptionalUser } from '~/utilities'

export default function CommentBox({
  postId,
  parentId,
  setIsReplying
}: {
  postId: Post['id']
  parentId?: string
  userId?: string
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const user = useOptionalUser()
  const commentFetcher = useFetcher()

  const formRef = React.useRef<HTMLFormElement>(null)
  let isDone = commentFetcher.state === 'idle' && commentFetcher.data != null
  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
      setIsReplying?.(false)
    }
  }, [isDone, setIsReplying])
  return (
    <div className='flex flex-col gap-2 rounded-lg bg-white px-2 py-2 shadow'>
      {user && (
        <commentFetcher.Form
          ref={formRef}
          className='flex items-center gap-4'
          action={`/blog/${postId}/comment`}
          method='POST'
        >
          <input type='hidden' name='postId' value={postId} />
          {parentId && <input type='hidden' name='parentId' value={parentId} />}

          <input
            id='message'
            name='message'
            placeholder='Enter your comment here...'
            className='w-full rounded-md border-2 border-gray-300 p-2 text-sm text-black'
          />

          {user ? (
            <Button
              className='ml-auto'
              variant='primary_filled'
              size='tiny'
              type='submit'
            >
              {parentId ? 'Post reply' : 'Comment'}
            </Button>
          ) : (
            <p className='ml-auto text-sm text-gray-600'>
              You must be logged in to comment.
            </p>
          )}
        </commentFetcher.Form>
      )}
    </div>
  )
}
