import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo } from '~/utilities'
import CommentForm from './comment-form_v2'
import clsx from 'clsx'
import LikeComment from '~/components/comments/comment-like-box'

function Comment({ comment }: { comment: CommentWithChildren }) {
  const [replying, setReplying] = React.useState(false)
  const avatarUrl = comment.user.avatarUrl || ''
  return (
    <div className='flex flex-col gap-3 pl-2x not-prose border-l-2'>
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
            <LikeComment
              commentId={comment.id}
              likes={comment.likes}
              commentLikesNumber={comment.likes.length}
            />
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
        <ListComments comments={comment.children} sib={true} />
      )}
    </div>
  )
}
function ListComments({
  comments,
  sib
}: {
  comments: CommentWithChildren[]
  sib?: boolean
}) {
  console.log(comments, 'comments from list comments')

  let isSib = sib ? 'pl-4' : 'pl-2'
  return (
    <div className={clsx('flex flex-col gap-3 rounded-md', isSib)}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default ListComments
