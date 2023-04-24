import { Avatar } from '@mantine/core'
import type { Post } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { RowBox } from '~/components/boxes'
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

  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (commentFetcher.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [commentFetcher.state])

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
            <Avatar
              src={user?.avatarUrl}
              alt={user?.username}
              size='sm'
              radius='xl'
            />
            <input type='hidden' name='postId' value={postId} />
            {parentId && (
              <input type='hidden' name='parentId' value={parentId} />
            )}

            {/* <label
            className='text-sm font-medium text-gray-700 dark:text-slate-50'
            htmlFor='message'
          >
            Comment
          </label> */}
            <input
              id='message'
              name='message'
              placeholder='Enter your comment here...'
              className='w-full rounded-xl border-2 p-2 text-xs text-black'
            />
            <Button
              className='absolute right-0 top-8'
              variant='ghost'
              size='tiny'
              type='submit'
            >
              {parentId ? 'Post reply' : 'Post a comment'}
            </Button>
            <RowBox>
              <div className='flex flex-grow' />
            </RowBox>
          </commentFetcher.Form>
        </div>
      )}
    </div>
  )
}