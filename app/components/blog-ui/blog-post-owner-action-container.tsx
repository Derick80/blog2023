import { Form, Link } from '@remix-run/react'
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import React from 'react'
import ConfirmationDialog from '../confirmation-dialog'
import { Button } from '~/components/ui/button'

export type BlogPostOwnerActionProps = {
  postId: string
}

export default function BlogPostOwnerAction({
  postId
}: BlogPostOwnerActionProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    // Show the confirmation dialog
    event.preventDefault()
    setConfirmDelete(true)
  }

  const handleConfirm = () => {
    // Perform the actual form submission
    console.log('Form submitted!')
    // Close the dialog
    setConfirmDelete(false)
  }

  const handleCancel = () => {
    // Close the dialog
    setConfirmDelete(false)
  }
  return (
    <div className='flex flex-row gap-2'>
      <Button variant='ghost' size='icon'>
        <Link
          title='If you are logged in and own this post, you can edit it'
          to={`/blog/${postId}/edit`}
        >
          <Pencil2Icon />
        </Link>
      </Button>
      <Form method='POST' action={`/blog/${postId}/delete`}>
        <Button
          type='submit'
          name='action'
          value='delete'
          variant='ghost'
          size='icon'
          onClick={handleSubmit}
        >
          <TrashIcon />
        </Button>
        {/* Confirmation Dialog */}
        {confirmDelete && (
          <ConfirmationDialog
            title='Confirm Submission'
            message='Are you sure you want to submit the form?'
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </Form>
    </div>
  )
}
