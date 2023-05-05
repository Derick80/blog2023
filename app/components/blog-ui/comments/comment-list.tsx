import { useFetcher } from '@remix-run/react'
import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import CommentBox from './comment-box'
import Button from '~/components/button'
import { useMatchesData, useOptionalUser } from '~/utilities'
import { RowBox } from '~/components/boxes'
import { Image } from '@mantine/core'
import {
  ChevronDownIcon} from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import type { CommentLike } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import VerticalMenu from '~/components/vertical-menu'
import LikeComment from './comment-like-box'
import EditCommentForm from './edit-comment-form'

function getReplyCountText(count: number) {
  if (count === 0 || !count) {
    return ''
  }

  if (count === 1) {
    return '1 reply'
  }

  return `${count} replies`
}
// COmment Container is the parent component that holds all the main comment data. Since I retrieve all the comments in the blog loader I first filter here by postId and THEN since I call the comment component recursively I filter again by parentId.
export default function CommentContainer({ postId }: { postId: string }) {
  const matches = useMatchesData('routes/blog')
  const comments = matches?.comments as CommentWithChildren[]

  // This function filters the comments by postId and then filters out the comments that have a parentId.
  function filterComments(comments: CommentWithChildren[], postId: string) {
    return comments
      ?.filter((comment: { postId: string }) => comment.postId === postId)
      .filter((comment) => !comment.parentId)
  }
  const filteredComments = filterComments(comments, postId)

  if (!filteredComments) return null
  return (
    <div className='flex flex-col rounded-md'>
      {filteredComments.map((comment: CommentWithChildren) => (
        <Comment
          key={comment?.id}
          comments={comment}
          children={comment?.children}
        />
      ))}
    </div>
  )
}

//
function SiblingComments({ commentId }: { commentId: string }) {
  // the fuction takes the commentID as a param and loads data from the loader that contains the sibling comments of the parent ID. This is the data that is passed to the comment component recursively to display the sibling comments
  const sibFetcher = useFetcher()

  React.useEffect(() => {
    if (sibFetcher.state === 'idle') {
      sibFetcher.load(`/comment/${commentId}`)
    }
  }, [])

  return (
    <>
      <div className='ml-5 rounded-md shadow-lg'>
        {sibFetcher?.data?.comments?.map((comment: CommentWithChildren) => (
          <>
            <Comment key={comment?.id} comments={comment} />
            <CommentReplyBox
              
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
  const deleteFetcher = useFetcher()

  // using the deleteFetcher to delete the comment with onClick solves the weird riddle of fetcher.form and items-center
  const onClick = () => {
    deleteFetcher.submit(
      {
        commentId: comments.id,
        action: 'delete'
      },
      {
        method: 'post',
        action: `/comment/${comments.id}`
      }
    )
  }

  return (
    <div
      className='flex w-full flex-col gap-1 rounded-md
      shadow-md drop-shadow-md'
    >
      <RowBox className='relative w-full p-1'>
        <div className='relative w-full rounded-md  p-1'>
          <RowBox>
            <Image
              src={comments?.user?.avatarUrl}
              alt={comments?.user?.username}
              radius='xl'
              width={24}
              height={24}
            />
            <p className='text-xs text-slate-900'>
              {comments?.user?.username} replied ...
            </p>
          </RowBox>
          {editing ? (
            <EditCommentForm
              setEditing={setEditing}
              commentId={comments.id}
              message={comments.message}
            />
          ) : (
            <p className='prose flex text-sm'>{comments?.message}</p>
          )}
          <div className='flex w-full items-center'>

            <UserCommentResponseBox
              commentId={comments.id}
              commentLength={comments?.likes?.length}
              likes={comments.likes}
            />
            {user?.id === comments.userId && (
              <>
                <VerticalMenu>
                  <Button
                    variant={editing ? 'danger_filled' : 'warning_filled'}
                    size='small'
                    className='flex flex-row justify-between gap-2 text-xs'
                    onClick={() => setEditing((editing) => !editing)}
                  >
                    <p className='flex flex-row gap-2 text-xs text-black '>
                      {editing ? 'Cancel' : 'Edit'}
                    </p>
                  </Button>

                  <Button
                    onClick={onClick}
                    variant='danger_filled'
                    size='tiny'
                    type='submit'
                    name='action'
                    value='delete'
                  >
                    Delete
                  </Button>
                </VerticalMenu>
              </>
            )}

            {user ? (
              <Button
                className=''
                variant={isReplying ? 'warning_filled' : 'primary_filled'}
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
          </div>
        </div>

        {comments.children?.length > 0 && !open ? (
          <Button
            variant='icon_unfilled'
            size='small'
            className='flex flex-row items-center justify-between gap-1 text-xs'
            onClick={() => setOpen((open) => !open)}
          >
        
            <p className='flex flex-row gap-2 text-xs text-black '>
              {getReplyCountText(comments.children?.length)}
              <ChevronDownIcon />
            </p>
          </Button>
        ): (
          <div className='flex flex-grow'/>
        )
      
      }
        <div className='flex flex-col gap-1'></div>
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

// although underutilized this holds the like button.  
function UserCommentResponseBox({
  commentId,
  commentLength,
  likes
}: {
  commentId: string
  commentLength: number
  likes: SerializeFrom<CommentLike[]>
}) {
  return (
    <div className='flex w-full  flex-row items-center justify-between gap-2'>
      <LikeComment
        commentId={commentId}
        commentLikesNumber={commentLength}
        likes={likes}
      />
    </div>
  )
}


// This box is passed a commentId which is passed to the comment form so that a user can reply to a previous comment

function CommentReplyBox({
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
      <CommentBox postId={postId} parentId={commentId} userId={userId}
        setIsReplying={setIsReplying}
      />
  )
}
