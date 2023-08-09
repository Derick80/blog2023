import { useFetcher } from '@remix-run/react'
import React from 'react'
import Button from '~/components/v3-components/button'
// Use this form to edit a specific comment
export default function EditCommentForm({
  commentId,
  message,
  setEditing
}: {
  commentId: string
  message: string

  setEditing: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const commentEditFetcher = useFetcher()

  // this seems to work to reset the form
  let isDone =
    commentEditFetcher.state === 'idle' && commentEditFetcher.data != null

  //  coupling the form reset and the setEditing to the isDone variable creates a nicely synced process of resetting the form and setting the editing state to false.  Having the form reset in it's own use effect above caused the form to visually reset (the data was still saved correctly) before the editing state was set to false.  Bad UX experience.  This wsay is much better
  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
      setEditing(false)
    }
  }, [isDone, setEditing])

  return (
    <commentEditFetcher.Form
      ref={formRef}
      className='flex w-full flex-row items-center gap-1'
      method='POST'
      action={`/comment/${commentId}`}
    >
      <input
        type='text'
        name='message'
        defaultValue={message}
        className='w-full rounded-md p-1 text-black'
        autoFocus
      />
      <Button
        variant='success_filled'
        size='small'
        name='action'
        value='edit'
        type='submit'
      >
        {commentEditFetcher.state === 'submitting' ? 'Saving' : 'Save'}
      </Button>
    </commentEditFetcher.Form>
  )
}
