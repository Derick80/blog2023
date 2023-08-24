import Button from '../../button'
import { Form, Link } from '@remix-run/react'
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'

export type BlogPostOwnerActionProps = {
  postId: string
}

export default function BlogPostOwnerAction({
  postId
}: BlogPostOwnerActionProps) {
  return (
    <div className='flex flex-row gap-2'>
      <Button variant='icon_unfilled' size='tiny'>
        <Link
          title='If you are logged in and own this post, you can edit it'
          to={`/blog/${postId}/edit`}
        >
          <Pencil2Icon />
        </Link>
      </Button>
      <Form method='POST' action={`/${postId}/delete`}>
        <Button
          name='action'
          value='delete'
          variant='icon_unfilled'
          size='tiny'
        >
          <TrashIcon />
        </Button>
      </Form>
    </div>
  )
}
