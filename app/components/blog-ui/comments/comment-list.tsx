import { Form, useFetcher } from '@remix-run/react'
import React from 'react'
import type { CommentWithChildren } from '~/server/schemas/schemas'
import CommentBox from './comment-box'
import Button from '~/components/button'
import { useMatchesData } from '~/utilities'
import { ColBox, RowBox } from '~/components/boxes'
import { Avatar } from '@mantine/core'
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'

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
              replyCount={comment.children?.length}
            />
          </>
        ))}
      </div>
    </>
  )
}
//  This is the comment component that holds the comment and the reply button
function Comment({
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
  const [isReplying, setIsReplying] = React.useState(false)

  return (
    <div className='flex flex-col gap-1 rounded-md  shadow-md'>
      <RowBox className='relative'>
        <Avatar
          src={comments?.user?.avatarUrl}
          alt={comments?.user?.username}
          radius='xl'
          size='sm'
        />
        <ColBox>
          <p className='text-xs font-medium text-gray-700 dark:text-slate-50'></p>
          <div className='relative rounded-md bg-slate-900/30 p-1'>
            {comments?.user?.username}

          {
            editing ? (
              <Form method="POST" action={`/comment/${comments.id}/edit`}>
                <textarea
                  name="message"
                  defaultValue={comments.message}
                  className="w-full"
                />
                <button type="submit">Submit</button>
                </Form>
                

            ) : (
              <p className='flex w-full text-sm'>{comments?.message}</p>
            )

          }
            <div className='absolute flex w-full items-center'>
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
              
              <div className='flex flex-grow' />
              <Button
                className='absolute -top-0 right-0'
                variant='ghost'
                size='small'
                onClick={() => setIsReplying(!isReplying)}
              >
                {isReplying ? 'Cancel' : 'Reply'}
              </Button>
            </div>
          </div>
        </ColBox>
        <div className='flex flex-grow' />
        <Button
          variant='icon_unfilled'
          size='small'
          className='flex flex-row justify-between gap-2 text-xs'
          onClick={() => setOpen((open) => !open)}
        >
          <p className='flex flex-row gap-2 text-xs text-black'>
            {getReplyCountText(comments.children?.length)}
          </p>
          {open ? <ChevronUpIcon
            className='text-teal-400'
          /> : <ChevronDownIcon
          className='text-teal-400'

          />}
        </Button>
      </RowBox>
      <RowBox className='mt-5 w-full'>
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

function CommentActions({
  commentId,
  postId,
  userId,
  replyCount
}: {
  commentId: string

  postId: string
  userId: string
  replyCount: number
}) {
  return (
    <div className='flex w-full flex-row gap-2'>
      <CommentBox postId={postId} parentId={commentId} userId={userId} />

      <div className='flex flex-grow' />
    </div>
  )
}
