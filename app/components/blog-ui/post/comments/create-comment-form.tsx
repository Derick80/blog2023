import { useFetcher } from '@remix-run/react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

type CreateCommentFormProps = {
    postId: string
    parentId?: string
}


const CreateCommentForm = ({
    postId,
    parentId
}:CreateCommentFormProps) => {
    const createCommentFetcher = useFetcher()

const formRef = React.useRef<HTMLFormElement>(null)
 let isDone = createCommentFetcher.state === 'idle' && createCommentFetcher.data != null



  React.useEffect(() => {
    if (isDone) {
      formRef.current?.reset()
    }
  }, [isDone])
    return (
        <createCommentFetcher.Form
            ref={formRef}
            method='POST'
            className='flex flex-col gap-4 w-full'
        >
             {parentId && <input type='hidden' name='parentId' value={parentId} />}
            <Label htmlFor='message'>Comment</Label>
            <Textarea
                id='message'
                name='message'
                placeholder='Enter your comment here...'
               />
            <Button
                type='submit'
                variant='default'
                size='default'
                value='create-comment'
                name='intent'

            >
                Save Comment
            </Button>
        </createCommentFetcher.Form>
    )

}

export default CreateCommentForm
