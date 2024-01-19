import { useFetcher } from '@remix-run/react'
import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import CommentBox from './comment-box'
import { Button } from '~/components/ui/button'
import { formatDateAgo, useOptionalUser } from '~/utilities'
import { Cross2Icon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import LikeComment from './comment-like-box'
import EditCommentForm from './edit-comment-form'
const dropdownVariants = {
  open: { opacity: 1, height: 'auto', transition: { duration: 1 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.5 } }
}
function getReplyCountText (count: number) {
  if (count === 0 || !count) {
    return ''
  }

  if (count === 1) {
    return '1 reply'
  }

  return `${count} replies`
}
// COmment Container is the parent component that holds all the main comment data. Since I retrieve all the comments in the blog loader I first filter here by postId and THEN since I call the comment component recursively I filter again by parentId.
export default function CommentContainer ({
  postId,
  open
}: {
  postId: string
  open?: boolean
}) {
  // retrieve the data from the loader

  const commentFetcher = useFetcher()

  React.useEffect(() => {
    if (commentFetcher.state === 'idle') {
      commentFetcher.load(`/blog`)
    }
  }, [])

  const data = commentFetcher?.data as {
    comments: CommentWithChildren[]
  }

  const comments = data?.comments?.filter(
    (comment: CommentWithChildren) => comment.postId === postId
  )

  if (!comments)
    return (
      <div className='flex flex-col rounded-md'>
        <p>No comments yet</p>
      </div>
    )

  // This function filters the comments by postId and then filters out the comments that have a parentId.
  function filterComments (comments: CommentWithChildren[], postId: string) {
    return comments
      ?.filter((comment: { postId: string }) => comment.postId === postId)
      .filter((comment) => !comment.parentId)
  }
  const filteredComments = filterComments(comments, postId)

  if (!filteredComments) return null
  return (
    <div className='flex flex-col gap-1 rounded-md pl-2'>
      { filteredComments?.map(
        (comment: CommentWithChildren) =>
          open && (
            <AnimatePresence key={ comment?.id }>
              <motion.div
                initial='closed'
                animate='open'
                exit='closed'
                variants={ dropdownVariants }
              >
                <Comment
                  key={ comment?.id }
                  comments={ comment }
                  children={ comment?.children }
                />
              </motion.div>
            </AnimatePresence>
          )
      ) }
    </div>
  )
}

//
function SiblingComments ({ commentId }: { commentId: string }) {
  // the fuction takes the commentID as a param and loads data from the loader that contains the sibling comments of the parent ID. This is the data that is passed to the comment component recursively to display the sibling comments
  const sibFetcher = useFetcher()

  React.useEffect(() => {
    if (sibFetcher.state === 'idle') {
      sibFetcher.load(`/comment/${commentId}`)
    }
  }, [])

  return (
    <>
      <div className='border-1 ml-5 rounded-md shadow-lg'>
        { sibFetcher?.data?.comments?.map((comment: CommentWithChildren) => (
          <>
            <Comment key={ comment.id } comments={ comment } />
            <CommentReplyBox
              commentId={ comment.id }
              postId={ comment.postId }
              userId={ comment.userId }
            />
          </>
        )) }
      </div>
    </>
  )
}
//  This is the comment component that holds the comment and the reply button.  This is the place to add the edit button and the delete button
function Comment ({
  comments,
  children
}: {
  comments: CommentWithChildren & {
    children?: CommentWithChildren[]
  }
  children?: CommentWithChildren[]
}) {
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(false)

  return (
    <div className='flex w-full flex-col gap-1 rounded-md border-2 border-l-red-500'>
      <CommentCardUserOptions
        userAvatarUrl={ comments?.user?.avatarUrl || '' }
        username={ comments?.user?.username || '' }
        createdAt={ comments?.createdAt || '' }
        userId={ comments?.userId || '' }
        setEditing={ setEditing }
        setOpen={ setOpen }
        commentId={ comments?.id || '' }
        message={ comments?.message || '' }
        editing={ editing }
      >
        { editing ? (
          <EditCommentForm
            setEditing={ setEditing }
            commentId={ comments?.id }
            message={ comments?.message }
          />
        ) : (
          <div className='prose w-full flex-col justify-start text-sm dark:prose-invert'>
            <div className='prose flex items-center justify-between dark:prose-invert'>
              <div className='text-base leading-4'>{ comments?.message }</div>
              <LikeComment
                commentId={ comments?.id }
                commentLikesNumber={ comments?.likes?.length }
                likes={ comments?.likes }
              />
            </div>
            <SiblingComments commentId={ comments?.id } />
          </div>
        ) }
      </CommentCardUserOptions>
    </div>
  )
}

function CommentCardUserOptions ({
  userAvatarUrl,
  username,
  createdAt,
  userId,
  setEditing,
  setOpen,
  commentId,
  message,
  editing,
  children
}: {
  userAvatarUrl: string
  username: string
  createdAt: string
  userId: string
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  commentId: string
  message: string
  editing?: boolean
  children?: React.ReactNode
}) {
  const user = useOptionalUser()
  const deleteFetcher = useFetcher()
  // using the deleteFetcher to delete the comment with onClick solves the weird riddle of fetcher.form and items-center
  const onClick = () => {
    deleteFetcher.submit(
      {
        commentId,
        action: 'delete'
      },
      {
        method: 'post',
        action: `/comment/${commentId}`
      }
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex h-10 w-full flex-row items-center justify-between gap-1'>
        <div className='flex items-center'>
          <img
            src={ userAvatarUrl || '' }
            alt='user avatar'
            className='h-6 w-6 rounded-full'
          />
          <div className='text-xs font-semibold'>
            { username || '' } | { formatDateAgo(createdAt) }
          </div>
        </div>
        { user?.id === userId && (
          <div className='flex flex-row gap-1'>
            <Button
              variant='ghost'
              size='icon'
              onClick={ () => {
                setEditing(!editing)
                setOpen(false)
              } }
            >
              { editing ? <Cross2Icon /> : <Pencil1Icon /> }
            </Button>
            <Button variant='ghost' size='icon' onClick={ onClick }>
              <TrashIcon />
            </Button>
          </div>
        ) }
      </div>
      { children }
    </div>
  )
}

// This box is passed a commentId which is passed to the comment form so that a user can reply to a previous comment

function CommentReplyBox ({
  commentId,
  postId,
  userId,
  setIsReplying
}: {
  commentId: string
  setIsReplying?: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
  userId: string
}) {
  return (
    <CommentBox
      postId={ postId }
      parentId={ commentId }
      userId={ userId }
      setIsReplying={ setIsReplying }
    />
  )
}
