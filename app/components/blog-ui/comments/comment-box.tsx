import type { Post } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { RowBox } from '~/components/boxes'
import Button from '~/components/button'
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
    <div className='flex w-full flex-col gap-2'>
      {user && (
        <div className='flex items-center gap-2'>
          <commentFetcher.Form
            ref={formRef}
            className=' relative flex w-full flex-row items-center gap-2'
            action={`/blog/${postId}/comment`}
            method='POST'
          >
            <div className='h-6 w-6'>
              <img
                src={user?.avatarUrl || '/avatar.png'}
                alt={user?.username}
                width={24}
                height={24}
              />
            </div>
            <input type='hidden' name='postId' value={postId} />
            {parentId && (
              <input type='hidden' name='parentId' value={parentId} />
            )}

            <input
              id='message'
              name='message'
              placeholder='Enter your comment here...'
              className='w-full rounded-xl border-2 p-2 text-xs text-black'
            />
            {user ? (
              <Button
                className=' right-0 top-8'
                variant='primary_filled'
                size='tiny'
                type='submit'
              >
                {parentId ? 'Post reply' : 'Post a comment'}
              </Button>
            ) : (
              <>
                <p className='text-xs text-black'>
                  You must be logged in to comment.
                </p>
              </>
            )}
            <RowBox>
              <div className='flex flex-grow' />
            </RowBox>
          </commentFetcher.Form>
        </div>
      )}
    </div>
  )
}
