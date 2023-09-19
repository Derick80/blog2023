import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo } from '~/utilities'
import CommentForm from './comment-form_v2'

function Comment({ comment }: { comment: CommentWithChildren }) {
  const [replying, setReplying] = React.useState(false)
  const avatarUrl = comment.user.avatarUrl || ''
  return (
    <div className='flex flex-col gap-1 rounded-md pl-2x not-prose'>
      <div className='flex items-start gap-1'>
        <img
          className='w-6 h-6 rounded-full'
          src={avatarUrl}
          alt={`${comment.user.username}'s avatar`}
        />
        <div className='flex flex-col'>
          <span className='text-sm font-bold'>{comment.user.username}</span>

          <p>{comment?.message}</p>
          <div className='flex items-center gap-1'>
            <span className='text-xs text-gray-600'> x number likes</span>
            <span className='text-xs text-gray-600'>
              Posted {formatDateAgo(comment.createdAt)}
            </span>
            <button onClick={() => setReplying(!replying)}>Reply</button>
          </div>
          {replying && (
            <div className='flex flex-col gap-1'>
              <CommentForm parentId={comment?.id} setReplying={setReplying} />
            </div>
          )}
        </div>
      </div>
      {comment.children && comment.children.length > 0 && (
        <ListComments comments={comment.children} />
      )}
    </div>
  )
}
function ListComments({ comments }: { comments: CommentWithChildren[] }) {
  console.log(comments, 'comments from list comments')

  return (
    <div className='flex flex-col gap-1 rounded-md pl-2'>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default ListComments
