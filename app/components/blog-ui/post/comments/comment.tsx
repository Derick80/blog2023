import React from 'react'
import { Button } from '~/components/ui/button'
import { P, Small } from '~/components/ui/typography'
import { cn } from '~/lib/utils'
import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo } from '~/utilities'
import CommentList from './list-comments'
import { useFetcher, useMatches, useRouteLoaderData } from '@remix-run/react'
import { loader } from '~/routes/blog_.$postId'

const CommentBox = ({
  comment,
  depth = 1
}: {
  comment: Comment
  depth?: number
  }) => {
  const {
    id,
    user,
    message,
    createdAt,
    parentId,
    children
  } = comment

  console.log(id,'id');

  const [showReplies, setShowReplies] = React.useState(true)
  const commentFetcher = useFetcher<typeof loader>()

  const data = useRouteLoaderData<typeof loader>('routes/blog_.$postId')

  const postComments = data?.comments


  const childComments = postComments?.filter((c) => c.parentId === id)

  console.log(childComments, 'child comments');




  return (
      <>
      <li className='list-none'>
              <div className='flex flex-col bg-muted hover:bg-accent p-2 rounded-md'>
                  <CommentHeader>
                      <Small>{comment?.user?.username}</Small>
                        <Small>{formatDateAgo(comment.createdAt)}</Small>
                  </CommentHeader>
        <div  className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        )}>{comment?.message}</div>

        <CommentFooter>
            <div
              className='flex flex-row items-center gap-2'>
             <Button
            variant='default'
            size='default'
            value='create-comment'
            name='intent'
            >
            Reply
          </Button>
          <Button
            variant='default'
            size='default'
            value='edit-comment'
            name='intent'
            >
            Edit
            </Button>
              </div>

        </CommentFooter>
      </div>
          </li>

<Button
                type='button'
                variant='default'
                size='default'
                value='show-replies'
                name='intent'
                >
                Show Replies
      </Button>
      stuff here
      {

        childComments &&
        childComments.map((comment) => (
          <CommentList commentList={ comment }
            key={ comment.id } />
        ))
      }
      </>
  )
}

type CommentFooterProps = {
  children?: React.ReactNode
}
const CommentFooter = ({ children }: CommentFooterProps) => {
  return (
      <div className='flex flex-col items-center gap-2 border border-teal-500'>
            {children}
    </div>
  )
}

export default CommentBox


type CommentHeaderProps = {
    children?: React.ReactNode
}

const CommentHeader = ({ children }: CommentHeaderProps) => {
    return (
        <div className='flex flex-row items-center justify-between gap-2 border border-purple-500'>
            {children}
        </div>
    )
}

