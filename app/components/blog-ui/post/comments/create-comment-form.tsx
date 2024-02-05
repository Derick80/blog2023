import { useActionData, useFetcher } from '@remix-run/react'
import { SaveIcon } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { action } from '~/routes/blog_.$postId'

type CreateCommentFormProps = {
  postId: string
  parentId?: string | null
  message?: string
  intent: string
  commentId?: string
  editComment?: boolean
  setShowReply?: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCommentForm = ({
  postId,
  message,
  parentId,
  intent,
  commentId,
  editComment,
}: CreateCommentFormProps) => {
  const actionData = useActionData<{
    intent: 'edit-comment'
    commentId: string
    message: string

  }>()

  const [isMessage, setIsMessage] = React.useState(message)

  const createCommentFetcher = useFetcher<typeof action>({
    key:'create-comment'
  })

  const formRef = React.useRef<HTMLFormElement>(null)
  let isDone =
    createCommentFetcher.state === 'idle' && createCommentFetcher.data != null

  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
    }
  }, [isDone])
  return (
    <createCommentFetcher.Form

      ref={formRef}
      method='POST'
 className={cn(
    "transition-opacity duration-500",
    { "opacity-0": !editComment },
    { "opacity-100": editComment }
  )}
    >
      {commentId && <Input type='hidden' name='commentId' value={commentId} />}
      {parentId && <Input type='hidden' name='parentId' value={parentId} />}
      <Label htmlFor='message' aria-label='message' className='sr-only' />
      <Textarea
        id='message'
        name='message'
        value={isMessage}
        onChange={(e) => setIsMessage(e.target.value)}
        placeholder='Enter your comment here...'
      />

      <Button

        type='submit'
        variant='ghost'
        size='default'
        value={intent}
        name='intent'
        onClick={() => {
          intent === 'edit-comment'

        }}
      >
       <SaveIcon className='text-primary md:size-6 size-4' />
      </Button>
    </createCommentFetcher.Form>
  )
}

export default CreateCommentForm
