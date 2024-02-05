import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { useParams } from '@remix-run/react'
import CommentBox from './comment'

const CommentList = ({ commentList }: { commentList: Comment }) => {
  const postId = useParams().postId
  if (!postId) return null

  return (
    <ul className='[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5 space-y-2 w-full'>
      <CommentBox comment={commentList} depth={1} />
    </ul>
  )
}

export default CommentList
