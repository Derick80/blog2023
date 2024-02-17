import { Form, useNavigation } from '@remix-run/react'
import { MessageCircleReply, SaveIcon } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { useOptionalUser, useUser } from '~/utilities'
import { useToggle } from './comment'

type CreateCommentFormProps = {
  parentId?: string
  setState: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCommentForm = ({ parentId, setState }: CreateCommentFormProps) => {
  const [commenting, setIsCommenting] = React.useState(false)
  const user = useOptionalUser()

  const formRef = React.useRef<HTMLFormElement>(null)

  let navigation = useNavigation()
  // transition.type === "actionSubmission"
  const isActionSubmission = navigation.state === 'submitting'

  let isDone =
    navigation.formData &&
    navigation.formData.get('intent') === 'create-comment' &&
    navigation.state === 'submitting'

  React.useEffect(() => {
    if (!isDone) {
      formRef.current?.reset()
    }
    if (!isDone && parentId) {
      formRef.current?.reset()
      setState((prev) => !prev)
    }
  }, [isDone])

  return (
    <>
      <div className='text-[8px] text-primary'>replying...</div>
      <Form
        ref={formRef}
        method='POST'
        className='w-full h-auto flex flex-col items-end  '
      >
        <input type='hidden' name='parentId' value={parentId} />
        {!parentId && (
          <Label htmlFor='message' className='w-full'>
            Comment
          </Label>
        )}
        <Textarea
          placeholder='comment here'
          name='message'
          id='message'
          className='w-full '
        />

        <Button
          size='xs'
          type='submit'
          name='intent'
          value='create-comment'
          disabled={isActionSubmission}
        >
          <SaveIcon className='mr-2 h-4 w-4' />
          {parentId ? 'Send' : 'Comment'}
        </Button>
      </Form>
    </>
  )
}

export default CreateCommentForm
