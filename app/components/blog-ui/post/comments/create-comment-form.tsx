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
  parentId?: string | null
  message?: string
  intent: 'create-comment' | 'edit-comment' | 'reply-comment'
  commentId?: string
  editComment?: boolean
  setEditComment?: (value: boolean) => void

}

const CreateCommentForm = ({
  message = '',
  parentId,
  intent='create-comment',
  commentId,
  editComment,
  setEditComment
}: CreateCommentFormProps) => {


  const [isMessage, setIsMessage] = React.useState(message)

  const createCommentFetcher = useFetcher<typeof action>({
    key: intent
  })

  const isSubmitting = createCommentFetcher.state !== 'idle'


  const formRef = React.useRef<HTMLFormElement>(null)
  let isDone =
    createCommentFetcher.state === 'idle' && createCommentFetcher.data != null

  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset();
      setIsMessage('')
    }
  }, [isDone])
  return (
    <createCommentFetcher.Form

      ref={formRef}
      method='POST'
 className={cn(
    "transition-opacity duration-500 w-full",
    { "opacity-0": !editComment || intent !== 'create-comment'},
    { "opacity-100": editComment || intent   ==='create-comment'}
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
        disabled={isSubmitting}
        type='submit'
        variant='ghost'
        size='default'
        value={intent}
        name='intent'
        onClick={
          (e) => {
            if(intent === 'edit-comment' && setEditComment && isDone){
              setEditComment(!editComment)

          }
          }
        }
      >
        {
          isSubmitting ? (
            <SaveIcon className='animate-spin' />
          ) : (
            'Submit'
          )
     }
      </Button>
    </createCommentFetcher.Form>
  )
}

export default CreateCommentForm
