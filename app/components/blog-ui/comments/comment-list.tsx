import { Form, FormMethod, useFetcher } from '@remix-run/react'
import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import CommentBox from './comment-box'
import Button from '~/components/button'
import { useMatchesData, useOptionalUser } from '~/utilities'
import { ColBox, RowBox } from '~/components/boxes'
import { Avatar, Tooltip } from '@mantine/core'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  HeartFilledIcon,
  HeartIcon
} from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { CommentLike } from '@prisma/client'

function getReplyCountText(count: number) {
  if (count === 0 || !count) {
    return ''
  }

  if (count === 1) {
    return '1 reply'
  }

  return `${count} replies`
}
// COmment Container is the parent component that holds all the main comment data
export default function CommentContainer({ postId }: { postId: string }) {
  const matches = useMatchesData('routes/blog')
  const comments = matches?.comments as CommentWithChildren[]

  function filterComments(comments: CommentWithChildren[], postId: string) {
    return comments.filter(
      (comment: { postId: string }) => comment.postId === postId
    )
  }
  const filteredComments = filterComments(comments, postId)

  return (
    <div className='flex flex-col'>
      {filteredComments.map((comment: CommentWithChildren) => (
        <Comment
          key={comment?.id}
          comments={comment}
          children={comment.children}
        />
      ))}
    </div>
  )
}

//
function SiblingComments({ commentId }: { commentId: string }) {
  const sibFetcher = useFetcher()

  React.useEffect(() => {
    if (sibFetcher.state === 'idle') {
      sibFetcher.load(`/comment/${commentId}`)
    }
  }, [])

  return (
    <>
      <div className='ml-5'>
        {sibFetcher?.data?.comments?.map((comment: CommentWithChildren) => (
          <>
            <Comment key={comment?.id} comments={comment} />
            <CommentActions
              commentId={comment.id}
              postId={comment.postId}
              userId={comment.userId}
            />
          </>
        ))}
      </div>
    </>
  )
}
//  This is the comment component that holds the comment and the reply button.  This is the place to add the edit button and the delete button
function Comment({
  comments,
  children
}: {
  comments: CommentWithChildren & {
    children?: CommentWithChildren[]
  }
  children?: CommentWithChildren[]
}) {
  const user = useOptionalUser()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(false)
  const [isReplying, setIsReplying] = React.useState(false)

  return (
    <div
      className='rounded- flex w-full flex-col gap-1
      shadow-md'
    >
      <RowBox className='relative w-full p-1'>
        <ColBox className='ml-2 mt-2 flex w-full flex-col'>
          <div className='bg-slsate-900/30 relative w-full rounded-md border-2 p-1'>
            {comments?.user?.username} replied ...
            <Avatar
              src={comments?.user?.avatarUrl}
              alt={comments?.user?.username}
              radius='xl'
              size='sm'
            />
            {editing ? (
              <CommentEditForm
                commentId={comments.id}
                message={comments.message}
              />
            ) : (
              <p className='flex text-sm'>{comments?.message}</p>
            )}
            <RowBox>
              {user?.id === comments.userId && (
                <div className='flex w-full flex-row gap-2 bg-purple-500'>
                  <div className=' flex w-full items-center justify-between'>
                    <Button
                      variant='icon_unfilled'
                      size='small'
                      className='flex flex-row justify-between gap-2 text-xs'
                      onClick={() => setEditing((editing) => !editing)}
                    >
                      <p className='flex flex-row gap-2 text-xs text-black'>
                        {editing ? 'Cancel' : 'Edit'}
                      </p>
                    </Button>
                  </div>
                </div>
              )}

              <div className='flex flex-grow'></div>
              {user ? (
                <Button
                  className=''
                  variant='ghost'
                  size='small'
                  onClick={() => setIsReplying(!isReplying)}
                >
                  {isReplying ? 'Cancel' : 'Reply'}
                </Button>
              ) : (
                <p>
                  <a href='/login'>Login</a> to reply
                </p>
              )}
            </RowBox>
          </div>

          <CommentActionBox
            commentId={comments.id}
            commentLength={comments?.likes?.length}
            likes={comments.likes}
          />
          <div className='flex flex-col gap-1'></div>
        </ColBox>

        {comments.children?.length > 0 && (
          <Button
            variant='icon_unfilled'
            size='small'
            className='flex flex-row items-center justify-between gap-1 text-xs'
            onClick={() => setOpen((open) => !open)}
          >
            <p className='flex flex-row gap-2 text-xs text-black'>
              {getReplyCountText(comments.children?.length)}

              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </p>
          </Button>
        )}
      </RowBox>
      <RowBox className='mt- w-full'>
        {
          <AnimatePresence>
            {isReplying && (
              <motion.div
                className='relative ml-5 w-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CommentBox
                  postId={comments.postId}
                  parentId={comments.id}
                  userId={comments.userId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        }
        <div className='flex flex-grow' />
      </RowBox>
      {
        <AnimatePresence>
          {open && <SiblingComments commentId={comments.id} />}
        </AnimatePresence>
      }
    </div>
  )
}

function CommentActionBox({
  commentId,
  commentLength,
  likes
}: {
  commentId: string
  commentLength: number
  likes: CommentLike[]
}) {
  const [editing, setEditing] = React.useState(false)

  return (
    <div className='bottom-0 left-1 flex  flex-row items-center justify-between gap-2'>
      <LikeComment
        commentId={commentId}
        commentLikesNumber={commentLength}
        likes={likes}
      />
      <Button
        variant='icon_unfilled'
        size='small'
        className='flex flex-row justify-between gap-2 text-xs'
        onClick={() => setEditing((editing) => !editing)}
      >
        <p className='flex flex-row gap-2 text-xs text-black'>
          {editing ? 'Cancel' : 'Edit'}
        </p>
      </Button>
    </div>
  )
}
function LikeComment({
  commentId,
  commentLikesNumber,
  likes
}: {
  commentId: string
  commentLikesNumber: number
  likes: CommentLike[]
}) {
  const likeCommentFetcher = useFetcher()
  const user = useOptionalUser()

  const currentUser = user?.id || ''
  const userLikedComment = likes?.find(({ userId }) => {
    return userId === currentUser
  })
    ? true
    : false

  const [likeCount, setLikeCount] = React.useState(commentLikesNumber || 0)
  const [liked, setLiked] = React.useState(userLikedComment)

  const toggleLike = async () => {
    let method: FormMethod = 'delete'
    if (userLikedComment) {
      setLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      method = 'post'
      setLiked(true)
      setLikeCount(likeCount + 1)
    }

    likeCommentFetcher.submit(
      {
        userId: currentUser,
        commentId
      },
      {
        method,
        action: `/comment/${commentId}/like`
      }
    )
  }

  return (
    <>
      {user ? (
        <button
          // className='absolute bottom-1 left-2 z-10'
          onClick={toggleLike}
        >
          {liked ? (
            <div className='flex flex-row items-center gap-1'>
              <HeartFilledIcon style={{ color: 'red', fill: 'red' }} />
              <p className='absolute  -bottom-1 right-0 text-[10px]'>
                {likeCount}
              </p>
            </div>
          ) : (
            <div className='flex flex-row items-center gap-1'>
              <HeartIcon />

              {likeCount > 0 && (
                <p className='absolute  -bottom-1 right-0 text-[10px]'>
                  {likeCount}
                </p>
              )}
            </div>
          )}
        </button>
      ) : (
        <>
          <Tooltip
            label='You must be logged in to like this post'
            position='top'
            withArrow
            arrowSize={8}
          >
            <HeartIcon />
          </Tooltip>
        </>
      )}
    </>
  )
}

function CommentEditForm({
  commentId,
  message
}: {
  commentId: string
  message: string
}) {
  const commentEditFetcher = useFetcher()
  return (
    <commentEditFetcher.Form
      className='w-full'
      method='POST'
      action={`/comment/${commentId}`}
    >
      <textarea name='message' defaultValue={message} className='w-full' />
      <button name='action' value='edit' type='submit'>
        Submit
      </button>
    </commentEditFetcher.Form>
  )
}

function CommentActions({
  commentId,
  postId,
  userId
}: {
  commentId: string

  postId: string
  userId: string
}) {
  return (
    <div className='flex w-full flex-row gap-2'>
      <CommentBox postId={postId} parentId={commentId} userId={userId} />
    </div>
  )
}
