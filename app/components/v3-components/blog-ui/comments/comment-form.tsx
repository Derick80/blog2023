import type { Post } from '@prisma/client'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useFetcher } from '@remix-run/react'
import React from 'react'
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
  const [reply, setReply] = React.useState(false)
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
    <div className='flex flex-col gap-4'>
      {user ? (
        <Button
          className='ml-auto'
          variant='icon_text_unfilled'
          size='tiny'
          type='submit'
          onClick={() => {
            setReply(!reply)
            setIsReplying?.(true)
          }}
        >
          {parentId ? (
            <>
              <ChatBubbleIcon />
              <span className='mr-2'>{reply ? 'Cancel' : 'Reply'}</span>
            </>
          ) : (
            <>
              <ChatBubbleIcon />
              <span className='mr-2'>Comment</span>
            </>
          )}
        </Button>
      ) : (
        <p className='ml-auto text-sm text-gray-600'>
          You must be logged in to comment.
        </p>
      )}
      {reply && (
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
          <Button
            variant='icon_text_filled'
            size='tiny'
            type='submit'
            disabled={commentFetcher.state === 'loading'}
          >
            <span className='mr-2'>Post</span>
          </Button>
        </commentFetcher.Form>
      )}
    </div>
  )
}
