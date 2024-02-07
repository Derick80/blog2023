import React, { Key } from 'react'
import { Button } from '~/components/ui/button'
import { Muted, Small } from '~/components/ui/typography'
import { CommentWithChildren } from '~/server/schemas/schemas'
import { formatDateAgo, useOptionalUser } from '~/utilities'
import { Form, useActionData, useFetcher, useSubmit } from '@remix-run/react'
import { action } from '~/routes/blog_.$postId'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Edit,
  MessageCircleReply,
  ThumbsUpIcon
} from 'lucide-react'
import EditableElement from '~/components/editable-element'
import { Textarea } from '~/components/ui/textarea'
import CreateCommentForm from './create-comment-form'

const CommentBox = ({
  comment,
  depth = 1,
  replyComment = false
}: {
  comment: CommentWithChildren
  depth?: number
  replyComment?: boolean
}) => {
  const replyRef = React.useRef<HTMLTextAreaElement>(null)
  const [myMessage, setMyMessage] = React.useState(comment.message)
  const [makeComment, setMakeComment] = React.useState('')
  const currentUser = useOptionalUser()

  // use the data to determine if the user is authenticated and logged in or not
  const commentUser = comment.userId

  const isOwner = currentUser?.id === commentUser
  const [commenting, setCommenting] = React.useState(false)
  const [editComment, setEditComment] = React.useState(false)
  const [showReplies, setShowReplies] = React.useState(false)
  const [replying, setReplying] = React.useState(false)

  const editFetcher = useFetcher({
    key: 'edit-comment'
  })

  const isDoneEditing = editFetcher.state === 'idle' && editFetcher.data != null

  React.useEffect(() => {
    if (isDoneEditing) {
      setEditComment(false)
    }
  }, [isDoneEditing])

  const deleteFetcher = useFetcher()

  const isDeleting =
    deleteFetcher.state === 'idle' && deleteFetcher.data != null




  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setReplying(!replying)
    }
    if(e.key === 'Enter' && e.shiftKey === false && replying && makeComment) {
createCommentFetcher.submit({
      message: makeComment,
      parentId: comment.id,
      intent: 'create-comment'
    }, {
      method: 'POST',

      })
    }

  }

  // handle focus on the reply button

  const handleReplyButton = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    setReplying(!replying)
    setTimeout(() => {
      replyRef.current?.focus()
    }, 0)
  }




  const createCommentFetcher = useFetcher<typeof action>({
    key: 'create-comment'
  })


  const doneCommenting = createCommentFetcher.state === 'idle' && createCommentFetcher.data != null


  React.useEffect(() => {
    if (doneCommenting) {
      setReplying(false)
      setMakeComment('')
    }
  }, [doneCommenting])


  return (
    <>
      <li className='list-none space-y-9'>
        <div className='flex flex-col bg-muted hover:bg-accent p-2 rounded-md'>
          <CommentHeader>
            <Small>{comment?.user?.username}</Small>
            <Small>{formatDateAgo(comment.createdAt)}</Small>
          </CommentHeader>
          <div className='flex flex-col gap-2 w-full'>
            <EditableElement
              value={comment.message}
              onChange={(value) => {
                setMyMessage(value)
                console.log('value', value)
              }}
            />
            <ul className='[&_&]:mt-1 [&_&]:border-l [&_&]:pl-5'>
              {
                replying && (
                  <div
                     className={`transition-opacity duration-500 ease-in-out ${replying ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transform`}
>
                    <CreateCommentForm
                  setState={setReplying}

                  parentId={ comment.id } />
                  </div>
                )
             }
            </ul>
          </div>

          <CommentFooter>
            <div className='flex flex-row gap-2 justify-between w-full items-center'>
              {comment.children && (
                <>
                  <Button
                    variant='ghost'
                    size='default'
                    value='reply-comment'
                    name='intent'
                    disabled={comment.children.length > 0 ? false : true}
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {showReplies ? (
                      <ChevronUpIcon className='text-primary md:size-6 size-4' />
                    ) : (
                      <ChevronDownIcon className='text-primary md:size-6 size-4' />
                    )}
                    <Muted className='text-primary text-[10px]'>
                      {comment.children.length === 0
                        ? 'No Replies'
                        : comment.children.length === 1
                          ? '1 Reply'
                          : `${comment.children.length} Replies`}
                    </Muted>
                  </Button>
                </>
              )}
              <Button
                size='xs'
                type='button'
                disabled={!currentUser}
                onClick={(e) => handleReplyButton(e)}

              >
              {replying ? 'Cancel' : <>  <MessageCircleReply className='mr-2 h-4 w-4' />
                Reply?</>}
              </Button>
              {isOwner && (
                <div className='flex flex-row items-center gap-2'></div>
              )}
              <div className='flex flex-row items-center gap-2'>
                <Button variant='ghost' size='default' disabled={!currentUser}>
                  <ThumbsUpIcon className='text-primary md:size-6 size-4' />

                  {comment?.likes?.length}
                </Button>
              </div>
            </div>
          </CommentFooter>
        </div>
      </li>
      <div className='flex flex-col gap-2'>
        {showReplies && (
          <ul className='[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5 space-y-2'>
            {' '}
            {comment.children?.map((child) => (
              <CommentBox key={child.id} comment={child} depth={depth + 2} />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

type CommentFooterProps = {
  children?: React.ReactNode
}
const CommentFooter = ({ children }: CommentFooterProps) => {
  return (
    <div className='flex mt-1 flex-col items-center gap-2 border border-teal-500 justify-between min-w-full'>
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


// I want to write a function that manages multiple true/false togglees. The function takes in the  setState function and updates it with the the opposite of it's current value and can be used to manage multiple states


export const useToggle = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
  return () => setState((prev) => !prev)
}
