import { useActionData, useFetcher } from '@remix-run/react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { action } from '~/routes/blog_.$postId'

type CreateCommentFormProps = {
  postId: string
  parentId?: string | null
  message?: string
  intent: string
  commentId?: string
  setShowReply?: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCommentForm = ({
  postId,
  message,
  parentId,
  intent,
  commentId,
  setShowReply
}: CreateCommentFormProps) => {
  const actionData = useActionData<{
    intent: 'edit-comment'
    commentId: string
    message: string
    setShowReply?: React.Dispatch<React.SetStateAction<boolean>>
  }>()

  const [isMessage, setIsMessage] = React.useState(message)

  const createCommentFetcher = useFetcher<typeof action>()

  const formRef = React.useRef<HTMLFormElement>(null)
  let isDone =
    createCommentFetcher.state === 'idle' && createCommentFetcher.data != null

  console.log(
    createCommentFetcher?.data,
    'createCommentFetcher.data from create comment form'
  )
  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
    }
  }, [isDone])
  return (
    <createCommentFetcher.Form
      ref={formRef}
      method='POST'
      className='flex flex-col gap-1 md:gap-2 w-full mt-2'
    >
      {commentId && <Input type='text' name='commentId' value={commentId} />}
      {parentId && <Input type='text' name='parentId' value={parentId} />}
      <Label htmlFor='message'>Comment Message</Label>
      <Textarea
        id='message'
        name='message'
        value={isMessage}
        onChange={(e) => setIsMessage(e.target.value)}
        placeholder='Enter your comment here...'
      />

      <Button
        type='submit'
        variant='default'
        size='default'
        value={intent}
        name='intent'
        onClick={() => {
          intent === 'edit-comment' &&
            setShowReply &&
            setShowReply(!setShowReply)
        }}
      >
        Save Comment
      </Button>
    </createCommentFetcher.Form>
  )
}

export default CreateCommentForm
