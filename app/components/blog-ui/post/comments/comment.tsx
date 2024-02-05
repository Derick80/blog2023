import React from 'react'
import { Button } from '~/components/ui/button'
import { Muted, P, Small } from '~/components/ui/typography'
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
  ReplyIcon,
  Save,
  ThumbsUpIcon,
  Trash2,
  XIcon
} from 'lucide-react'
import CreateCommentForm from './create-comment-form'
import { editCommentMessage } from '~/server/comment.server'
import { Input } from '~/components/ui/input'

const CommentBox = ({
  comment,
  depth = 1
}: {
    comment: Comment & {
      children?: Comment[]
  }

  depth?: number
  }) => {

  const [editComment, setEditComment] = React.useState(false)
  const [commentMessage, setCommentMessage] = React.useState(comment.message)

  const editFetcher = useFetcher({
    key: 'edit-comment'
  })

  const isDoneEditing = editFetcher.state === 'idle' && editFetcher.data !=  null

  const handleEditComment = async () => {
        editFetcher.submit({

      intent: 'edit-comment',
      commentId: comment.id,
      message: commentMessage

    },
      {
       method: 'POST',
    })

  }

  React.useEffect(() => {
    if (isDoneEditing) {
      setEditComment(false)
    }

  })
  return (
    <>
      <li className='list-none'>
        <div className='flex flex-col bg-muted hover:bg-accent p-2 rounded-md'>
          <CommentHeader>
            <Small>{comment?.user?.username}</Small>
            <Small>{formatDateAgo(comment.createdAt)}</Small>
          </CommentHeader>


          {
            editComment === true ? (
              <editFetcher.Form
                name='edit-comment'
                method='post'
                className={cn(
                  'transition-opacity duration-500 w-full',
                  { 'opacity-0': !editComment },
                  { 'opacity-100': editComment }
                ) }
              >
                <Input
                  type='hidden'
                  name='commentId'
                  value={ comment.id }
                />
                <Input
                  type='hidden'
                  name='message'
                  value={ commentMessage }
                  onChange={
                    handleEditComment
                  }
                  required
                />

                <Input
                  type='text'
                  name='message'
                  defaultValue={ comment.message }
                  onChange={ (e) => setCommentMessage(e.target.value) }
                  required
                />

                </editFetcher.Form>
            ) : (
                <P

                > { comment.message }</P>
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
                <ReplyIcon className='text-primary md:size-6 size-4' />
              </Button>

              {
                editComment === true ? (
                  <div
                    className='border-1 border-brown-500'
                  >
                    <Button
                    variant='ghost'
                    size='default'

                      onClick={ handleEditComment}

                  >
                      <Muted
                        className='text-primary md:size-6 size-4 hidden md:block'
                      >

                        save</Muted>
                      <Save
                        className='text-primary md:size-6 size-4'/>
                    </Button>
                    <Button
                      variant='ghost'
                      size='default'
                      value='edit-comment'
                      name='intent'
                      onClick={ () => setEditComment(!editComment) }
                    >
                      <Muted
                        className='text-primary md:size-6 size-4 hidden md:block'
                      >
                        cancel
                      </Muted>
                      <XIcon className='text-primary md:size-6 size-4' />
                    </Button>
                  </div>
                ) : (
                    <Button
                      variant='ghost'
                      size='default'
                      value='edit-comment'
                      name='intent'
                      onClick={() => setEditComment(!editComment)}
                    >
                      <Muted
                        className='text-primary md:size-6 size-4 hidden md:block'
                      >
                        edit
                      </Muted>
                      <Edit2Icon className='text-primary md:size-6 size-4' />
                    </Button>
                )
              }
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
      {comment.children &&
        comment.children.map((child) => (
          <CommentList comment={ child } key={ child.id }
          />
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


