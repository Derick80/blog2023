import { CommentWithChildren } from '~/server/schemas/schemas'
import formComments from '../../comment/formatComments'
import { Card } from '~/components/ui/card'
import { X } from 'lucide-react'
import { Form, useParams } from '@remix-run/react'
import { Caption, P } from '~/components/ui/typography'
import AvatarWithOptions from '~/components/avatar-with-options'
import { Button } from '~/components/ui/button'
import React from 'react'
import CreateCommentForm from './create-comment-form'

const CommentList = ({ comments }: { comments: CommentWithChildren[] }) => {
  const postId = useParams().postId
  if (!postId) return null
  // loop through the comments array and if a comment doesn't have children then return the comment and if it does then return the comment and the children commen

  // This function filters the comments by postId and then filters out the comments that have a parentId.
  function filterComments(comments: CommentWithChildren[], postId: string) {
    console.log(comments, 'comments from filter comments')

    return comments
      ?.filter((comment: { postId: string }) => comment.postId === postId)
      .filter((comment) => !comment.parentId)
  }
  const filteredComments = filterComments(comments, postId)

  if (!filteredComments) return null

  console.log(filteredComments, 'filtered comments')

  return (
    <div className='mt-5'>
      {filteredComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default CommentList

const Comment = ({
  comment,
  depth = 1
}: {
  comment: CommentWithChildren
  depth?: number
}) => {
  const [showReply, setShowReply] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  return (
    <ul className='[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5 border-b gap-5'>
      <li className='bg-secondary p-2 rounded-md'>
        {showReply || isEditing ? (
          <>
            <P className=' p-2 rounded-md'>{comment?.message}</P>
            <Caption>
              {showReply ? 'Reply' : null}
              {isEditing ? 'Editing the above message' : null}
            </Caption>
            <CreateCommentForm
              parentId={comment?.parentId}
              commentId={comment.id}
              postId={comment?.postId}
              setShowReply={setShowReply}
              intent={isEditing ? 'edit-comment' : 'reply-comment'}
              message={isEditing ? comment?.message : undefined}
            />
          </>
        ) : (
          <P className=' p-2 rounded-md'>{comment?.message}</P>
        )}

        <div className='flex items-center justify-between'>
          <Button
            variant='default'
            size='default'
            value='create-comment'
            name='intent'
            onClick={() => setShowReply(!showReply)}
          >
            {showReply ? 'Cancel' : 'Reply'}
          </Button>
          <Button
            variant='default'
            size='default'
            value='edit-comment'
            name='intent'
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </li>
      {comment?.children
        ? comment?.children?.map((child) => (
            <Comment key={child.id} comment={child} depth={depth + 1} />
          ))
        : null}

      <AvatarWithOptions user={comment.user} />
      <div>
        <p className='text-xs font-semibold'>{comment.user.username}</p>
        <p className='text-xs'>
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </ul>
  )
}
