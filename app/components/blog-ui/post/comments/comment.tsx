import React from 'react'
import { Button } from '~/components/ui/button'
import { Muted, P, Small } from '~/components/ui/typography'
import { cn } from '~/lib/utils'
import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo, useOptionalUser } from '~/utilities'
import CommentList from './list-comments'
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
  useSubmit
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
  Trash2Icon,
  XIcon
} from 'lucide-react'
import CreateCommentForm from './create-comment-form'
import { editCommentMessage } from '~/server/comment.server'
import { Input } from '~/components/ui/input'
import { flushSync } from 'react-dom'

const CommentBox = ({
  comment,
  depth = 1
}: {
  comment: Comment & {
    children?: Comment[]
  }

  depth?: number
}) => {
  const [myMessage, setMyMessage] = React.useState(comment.message)
  const currentUser = useOptionalUser()

  // use the data to determine if the user is authenticated and logged in or not
  const commentUser = comment.userId

  const isOwner = currentUser?.id === commentUser

  const [editComment, setEditComment] = React.useState(false)

  const editFetcher = useFetcher({
    key: 'edit-comment'
  })

  const isDoneEditing = editFetcher.state === 'idle' && editFetcher.data != null

  const handleEditComment = async ({
    event,
    target
  }: {

      event: React.FormEvent<HTMLFormElement>,
      target: string
    }) => {

    const { value } = event.target as HTMLInputElement
    console.log('value', value);

    event.preventDefault()
    setMyMessage(value)


    editFetcher.submit(
      {
        intent: 'edit-comment',
        commentId: comment.id,
        message: myMessage
      },
      {
        method: 'POST'
      }
    )
  }

  React.useEffect(() => {
    if (isDoneEditing) {
      setEditComment(false)
    }

  }, [isDoneEditing])

  const deleteFetcher = useFetcher({
    key: 'delete-comment'
  })
  const isSubmitting = deleteFetcher.state !== 'idle'

  return (
    <>
      <li className='list-none'>
        <div className='flex flex-col bg-muted hover:bg-accent p-2 rounded-md'>
          <CommentHeader>
            <Small>{comment?.user?.username}</Small>
            <Small>{formatDateAgo(comment.createdAt)}</Small>
          </CommentHeader>

          {editComment === true ? (
            <editFetcher.Form
              name='edit-form'
              method='post'
              className={cn(
                'transition-opacity duration-500 w-full',
                { 'opacity-0': !editComment },
                { 'opacity-100': editComment }
              ) }
            >
              <Input type='hidden' name='commentId' value={ comment.id } />
              <Input type='hidden' name='intent' value='edit-comment' />

              <Input
                type='text'
                name='message'
                defaultValue={myMessage}
                onChange={(e) => setMyMessage(e.target.value)}
              />
            </editFetcher.Form>
          ) : (
            <P> {myMessage}</P>
          )}

          <CommentFooter>
            <div className='flex flex-row items-center gap-2'>
              <Button variant='ghost' size='default' disabled={!currentUser}>
                <ThumbsUpIcon className='text-primary md:size-6 size-4' />

                {comment?.likes?.length}
              </Button>
              <Button variant='ghost' size='default' disabled={!currentUser}>
                <BookmarkIcon className='text-primary md:size-6 size-4' />
              </Button>
              <Button
                variant='ghost'
                size='default'
                value='create-comment'
                name='intent'
                disabled={!currentUser}
              >
                <ReplyIcon className='text-primary md:size-6 size-4' />
              </Button>
              {isOwner && (
                <div className='flex flex-row items-center gap-2'>
                  {editComment === true ? (
                    <div className='border-1 border-brown-500'>
                      <Button variant='ghost' size='default'
                        type='submit'
                        name='intent'
                        form='edit-form'
                        value='edit-comment'

                    onClick={
                (event) =>
                {
                  event.preventDefault()
                  let formData = editFetcher.formData as FormData
                  setMyMessage(myMessage)

                  editFetcher.submit(
                 formData,
                    {
                      method: 'POST'
                    }
                  )
                }

              }

                      >
                        <Muted className='text-primary md:size-6 size-4 hidden md:block'>
                          save
                        </Muted>
                        <Save className='text-primary md:size-6 size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='default'
                        value='edit-comment'
                        name='intent'
                        onClick={() => setEditComment(!editComment)}
                      >
                        <Muted className='text-primary md:size-6 size-4 hidden md:block'>
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
                      <Muted className='text-primary md:size-6 size-4 hidden md:block'>
                        edit
                      </Muted>
                      <Edit2Icon className='text-primary md:size-6 size-4' />
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='default'
                    value='delete-comment'
                    name='intent'
                    disabled={!isOwner}
                    onClick={() => {
                      deleteFetcher.submit(
                        {
                          intent: 'delete-comment',
                          commentId: comment.id
                        },
                        {
                          method: 'DELETE'
                        }
                      )
                    }}
                  >
                    {isSubmitting ? (
                      <Trash2Icon className='text-primary md:size-6 size-4 animate-spin' />
                    ) : (
                      <Trash2 className='text-primary md:size-6 size-4' />
                    )}{' '}
                  </Button>
                </div>
              )}
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
      {comment.children &&
        comment.children.map((child) => (
          <CommentList comment={child} key={child.id} />
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
