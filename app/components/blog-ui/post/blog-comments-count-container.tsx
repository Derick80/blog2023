import { NavLink } from '@remix-run/react'
import { ArrowUpRightSquareIcon, MessageSquare } from 'lucide-react'
import { Caption, Small } from '~/components/ui/typography'

type CommentPreviewProps = {
  commentLength: number
  postId: string
}

export const CommentPreview = ({
  commentLength,
  postId
}: CommentPreviewProps) => {
  return (
    <NavLink
      to={`/blog/${postId}`}
      className='flex flex-row items-center gap-2 cursor-pointer hover:text-primary-500 transition-colors duration-300 ease-in-out'
    >
      {commentLength > 0 ? (
        <div className='flex flex-row items-center gap-1 md:gap-2'>
          <MessageSquare className='text-primary md:size-6 size-4' />
          <Caption>{commentLength}</Caption>
          <Caption className='hidden md:block'>
            {commentLength === 1 ? 'Comment' : 'Comments'}
          </Caption>
        </div>
      ) : (
        <div className='flex flex-row items-center gap-1 md:gap-2'>
          <MessageSquare className='text-primary md:size-6 size-4' />
          <Caption>0 </Caption>
          <Caption className='hidden md:block'>Comments</Caption>
        </div>
      )}
    </NavLink>
  )
}
