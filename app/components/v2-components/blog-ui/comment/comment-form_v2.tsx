import { useFetcher, useParams } from '@remix-run/react'
import React from 'react'
import { Button } from '~/components/ui/button'

export default function CommentForm ({
  parentId,
  setReplying
}: {
  setReplying?: React.Dispatch<React.SetStateAction<boolean>>
  parentId?: string
  userId?: string
}) {
  const commentFetcher = useFetcher()
  const { postId } = useParams()
  const formRef = React.useRef<HTMLFormElement>(null)
  let isDone = commentFetcher.state === 'idle' && commentFetcher.data != null

  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
      setReplying?.(false)
    }
  }, [isDone, setReplying])

  return (
    <div className='flex flex-col gap-4'>
      <commentFetcher.Form
        ref={ formRef }
        className='flex items-center gap-4'
        action={ `/blog/${postId}/comment` }
        method='POST'
      >
        <input type='hidden' name='postId' value={ postId } />
        { parentId && <input type='hidden' name='parentId' value={ parentId } /> }

        <input
          id='message'
          name='message'
          placeholder='Enter your comment here...'
          className='w-full rounded-md border-2 border-gray-300 p-2 text-sm text-black'
        />
        <Button
          variant='ghost'
          size='icon'
          type='submit'
          disabled={ commentFetcher.state === 'loading' }
        >
          <span className='mr-2'>Post</span>
        </Button>
      </commentFetcher.Form>
    </div>
  )
}
