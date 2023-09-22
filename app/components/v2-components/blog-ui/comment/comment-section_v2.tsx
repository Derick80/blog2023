import type { Comment } from '~/server/schemas/schemas'
import formComments from './formatComments'
import CommentForm from './comment-form_v2'
import ListComments from './list-comments'

export type CommentSectionProps = {
  postId: string
  comments: Comment[] | null
}
export default function CommentSection({
  postId,
  comments
}: CommentSectionProps) {
  if (!comments) return null


  const formattedData = formComments(comments)

  return (
    <div className='flex flex-col gap-1 md:gap-2 lg:gap-3'>
      <CommentForm />
      {formattedData && formattedData.length > 0 && (
        <ListComments comments={formattedData} sib={false} />
      )}
    </div>
  )
}
