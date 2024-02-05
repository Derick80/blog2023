import React from 'react'
import { Button } from '~/components/ui/button'
import { P, Small } from '~/components/ui/typography'
import { cn } from '~/lib/utils'
import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo } from '~/utilities'
import CommentList from './list-comments'
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useMatches,
  useRouteLoaderData
} from '@remix-run/react'
import { action, loader } from '~/routes/blog_.$postId'
import { SerializeFrom } from '@remix-run/node'
import {
  BookmarkIcon,
  Edit2Icon,
  ReplyAll,
  ThumbsUpIcon,
  Trash2
} from 'lucide-react'
import CreateCommentForm from './create-comment-form'

const CommentBox = ({
  comment,
  depth = 1
}: {
  comment: Comment
  depth?: number
  }) => {
  const actionData = useActionData<typeof action>()

  const { id, user, message, createdAt, parentId, children } = comment
  const [optMessage, setOptMessage] = React.useState(message)
  const { comments } = useLoaderData<typeof loader>()

const [editComment, setEditComment] = React.useState(false)
  const [showReplies, setShowReplies] = React.useState(true)
console.log(optMessage, 'optMessage');

  const childComments = comments?.filter((c) => c.parentId === id)
  const fetcher = useFetcher({ key: 'create-comment' })
  // trying out named fetchers
  // I want to use the fetcher to edit the comment and reset the form
  React.useEffect(() => {

    if ( actionData?.data?.updatedComment.id === id) {
      setOptMessage(actionData.data?.updatedComment.message)
    }
  }, [fetcher.state, fetcher.data])


  return (
    <>
      <li className='list-none'>
        <div className='flex flex-col bg-muted hover:bg-accent p-2 rounded-md'>
          <CommentHeader>
            <Small>{comment?.user?.username}</Small>
            <Small>{formatDateAgo(comment.createdAt)}</Small>
          </CommentHeader>

            {
              editComment ? (
              <CreateCommentForm
                editComment={editComment}
                  postId={comment.postId}
                  intent='edit-comment'
                  commentId={id}
                  message={ message  }
                />
              ):(

                  <div

                  >{ message ||

                optMessage
                  }</div>
              )
          }


          <CommentFooter>
            <div className='flex flex-row items-center gap-2'>
              <Button variant='ghost' size='default'>
                <ThumbsUpIcon className='text-primary md:size-6 size-4' />

                {comment?.likes?.length}
              </Button>
              <Button variant='ghost' size='default'>
                <BookmarkIcon className='text-primary md:size-6 size-4' />
              </Button>
              <Button
                variant='ghost'
                size='default'
                value='create-comment'
                name='intent'
              >
                <ReplyAll className='text-primary md:size-6 size-4' />
              </Button>
              <Button
                variant='ghost'
                size='default'
                value='edit-comment'
                name='intent'
                onClick={() => setEditComment(!editComment)}
              >
                <Edit2Icon className='text-primary md:size-6 size-4' />
              </Button>
              <Button
                variant='ghost'
                size='default'
                value='delete-comment'
                name='intent'
              >
                <Trash2 className='text-primary md:size-6 size-4' />
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
      {childComments &&
        childComments.map((child) => (
          <CommentList commentList={child} key={child.id} />
        ))}
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
