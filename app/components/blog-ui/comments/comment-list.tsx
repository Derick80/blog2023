import {
  Link,
  useFetcher,
  useLoaderData,
  useMatches,
  useRouteLoaderData
} from '@remix-run/react'
import React from 'react'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import CommentBox from './comment-box'
import formComments from './format-comments'
import Button from '~/components/button'

export default function CommentContainer({ postId }: { postId: string }) {
  const fetcher = useFetcher()

  React.useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/blog/${postId}/comment`)
    }
  }, [fetcher, postId])

  if (!fetcher.data) return null

  const { comments } = fetcher.data as { comments: CommentWithChildren[] }

  console.log(fetcher.data, 'comments')

  return (
    <>
      <ListComments comments={comments} />{' '}
    </>
  )
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  const { message, children } = comment

  return (
    <>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>
          {comment.user?.avatarUrl ? (
            <img
              className='h-10 w-10 rounded-full'
              src={comment?.user?.avatarUrl}
              alt=''
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-400'>
              <UserPlaceHolder />
            </div>
          )}
        </div>
        <div className='ml-4'>
          <div className='text-sm'>
            <Link
              to={`/users/${comment.user.username}`}
              className='font-medium text-gray-900'
            >
              {comment.user.username}
            </Link>
          </div>
          <div className='mt-1 text-sm text-gray-700'>
            <p>{message}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-row'>
        <CommentActions
          commentId={comment.id}
          postId={comment.postId}
          userId={comment.userId}
        />
      </div>
      {children ? <ListComments comments={children} /> : null}
    </>
  )
}
export function ListComments({
  comments
}: {
  comments: CommentWithChildren[]
}) {
  return (
    <>
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />
      })}
    </>
  )
}

function CommentActions({
  commentId,
  postId,
  userId
}: {
  commentId: string
  postId: string
  userId: string
}) {
  const [isReplying, setIsReplying] = React.useState(false)

  return (
    <div className='flex flex-row gap-2'>
      <Button
        variant='primary_filled'
        size='small'
        onClick={() => setIsReplying(!isReplying)}
      >
        {isReplying ? 'Cancel' : 'Reply'}
      </Button>
      {isReplying && (
        <CommentBox postId={postId} parentId={commentId} userId={userId} />
      )}
    </div>
  )
}
