import type { Post } from '~/server/schemas/schemas'
import Button from '../../button'
import { Form, Link } from '@remix-run/react'

export default function Actions({ postId }: { postId: Post['id'] }) {
  return (
    <div className='flex flex-row gap-2'>
      <Button variant='primary_filled' size='tiny'>
        <Link
          title='If you are logged in and own this post, you can edit it'
          to={`/blog/${postId}/edit`}
        >
          Edit
        </Link>
      </Button>
      <Form method='POST' action={`/${postId}/delete`}>
        <Button
          name='action'
          value='delete'
          variant='danger_filled'
          size='tiny'
        >
          Delete
        </Button>
      </Form>
    </div>
  )
}
