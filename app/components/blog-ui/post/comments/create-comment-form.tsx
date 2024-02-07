import { useActionData, useFetcher } from '@remix-run/react'
import { SaveIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Muted } from '~/components/ui/typography'
import { cn } from '~/lib/utils'
import { action } from '~/routes/blog_.$postId'

type CreateCommentFormProps = {
  parentId?: string | null
  message?: string
  intent: 'create-comment' | 'edit-comment' | 'reply-comment'
  commentId?: string
  editComment?: boolean
  setEditComment?: (value: boolean) => void
  setReplying?: (value: boolean) => void
  replying?: boolean
}

const CreateCommentForm = ({
  message = '',
  parentId,
  intent = 'create-comment',
  commentId,
  editComment,
  setEditComment,
  setReplying,
  replying
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
      formRef.current?.reset()
      setIsMessage('')
    }
  }, [isDone])

  React.useEffect(() => {
    if (isDone) {
      if (intent === 'edit-comment' && setEditComment) {
        setEditComment(!editComment)
      }
      if (intent === 'reply-comment' && setReplying) {
        setReplying(!replying)
      }
    }

  })

  return (
    <div
      className={cn(
        'transition-opacity duration-500 w-full flex',
        { 'opacity-0': !editComment || intent !== 'create-comment'  && intent !== 'reply-comment'},
        { 'opacity-100': editComment || intent === 'create-comment' || intent === 'reply-comment'}
      )}
    >

    <createCommentFetcher.Form
      ref={formRef}
      method='POST'
        className='flex flex-row justify-between w-full gap-2'
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
    <div className='flex flex-col items-center gap-2'>
      <Button
        disabled={isSubmitting}
        type='submit'
        variant='ghost'
        size='default'
        value={intent}
        name='intent'
        onClick={(e) => {
          if (intent === 'edit-comment' && setEditComment && isDone) {
            setEditComment(!editComment)
          }
          if (intent === 'reply-comment' && setReplying && isDone) {
            setReplying(!replying)
          }
        }}
      >

        </Button>
         <Button
                  variant='ghost'
                  size='default'
                  type='submit'
                  value='reply-comment'
                  name='intent'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <SaveIcon className='text-primary md:size-6 size-4 animate-spin' />
                  ) : (
                    <SaveIcon className='text-primary md:size-6 size-4' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='default'
                  type='button'
          onClick={ () => {
            if (intent === 'edit-comment' && setEditComment) {
              setEditComment(!editComment)
            }
            if (intent === 'reply-comment' && setReplying) {
              setReplying(!replying)
            }
          }
          }

                >


                  <Muted className='text-primary md:size-6 size-4 hidden md:block'>
                    cancel
                  </Muted>
                  <XIcon className='text-primary md:size-6 size-4' />
                </Button>
        </div>
      </createCommentFetcher.Form>
      </div>
  )
}

export default CreateCommentForm
