import {
  ChatBubbleIcon,
  ChevronUpIcon,
  HeartIcon,
  PlusCircledIcon
} from '@radix-ui/react-icons'
import { Transition } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor
} from '~/components/ui/popover'

import { useFetcher, useLoaderData, useLocation } from '@remix-run/react'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsDownUp,
  DeleteIcon,
  Link,
  MoreVerticalIcon,
  ReplyIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XIcon
} from 'lucide-react'
import React, { Fragment } from 'react'
import { isAdding, isProcessing } from '~/components/form-submit-state'
import { LoggedIn } from '~/components/logged-in'
import Editor from '~/components/tiptap/editor'
import { cn } from '~/lib/utils'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { loader } from '~/routes/blog_.drafts_.$postId'
import { useOptionalUser, useRootLoaderData } from '~/utilities'
import { LoggedOut } from '../logged-out'
import { Button } from '~/components/ui/button'
import { Muted } from '~/components/ui/typography'

export function Comments({ comments }: { comments: Comment[] | null }) {
  const { user } = useRootLoaderData()

  const { post } = useLoaderData<typeof loader>()

  let location = useLocation()

  return (
    <>
      <div className='mx-auto max-w-[728px] max-tablet:px-3 laptop:w-[728px] py-6 laptop:pb-40'>
        <LoggedIn>
          <div className='pb-5'>
            {/* <Editor

               postId={ post.id } /> */}
          </div>
        </LoggedIn>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentRow
              key={comment?.id}
              userId={user?.id}
              comment={comment}
              comments={comments}
              topLevelIndex={index}
              postId={post.id}
            />
          ))
        ) : (
          <LoggedOut>
            <div>
              <div className='mb-5 text-sm pl-4 border-l-2 border-color-sub'>
                <Link
                  className='underline font-bold pr-1 hover:text-blue-500'
                  to={`/login?redirectTo=${location.pathname}`}
                >
                  Login
                </Link>
                <span className='text-1'>to leave a comment...</span>
              </div>
              <CommentsEditor postId={post.id} />
            </div>
          </LoggedOut>
        )}
      </div>
    </>
  )
}

function CommentRow({
  comment,
  comments,
  userId,
  isNested,
  topLevelIndex,
  postId
}: {
  comment: Comment
  comments: Comment[]
  userId: string | undefined
  isNested?: Boolean
  topLevelIndex?: number
  postId: string
}) {
  const user = useOptionalUser()
  const [isReplyOpen, setReplyOpen] = React.useState(true)
  const [isCommentExpanded, setCommentExpanded] = React.useState(false)
  const isLiked = comment?.likes?.some((like) => like.userId === userId)
  const [likeCount, setLikeCount] = React.useState(comment?.likes?.length)
  const fetcher = useFetcher({ key: 'comments' })

  //Hide the comment field after submission
  React.useEffect(
    function resetFormOnSuccess() {
      //@ts-ignore
      if (fetcher.state === 'idle' && fetcher.data?.message == 'ok') {
        return setReplyOpen(false)
      }
    },
    [fetcher.state, fetcher.data]
  )

  return (
    <>
      <div
        className={cn(
          isNested
            ? `relative before:content-[''] before:absolute before:left-3
         before:dark:bg-zinc-700 before:bg-[#ededed] before:h-full before:w-[1px] rounded-full`
            : 'mb-3'
        )}
      >
        <div className='flex items-center gap-2 relative'>
          <div
            className='dark:border-zinc-600 bg-zinc-50 border dark:bg-zinc-700 justify-center shadow-sm shadow-1
                        flex h-6 w-6 flex-none items-center overflow-hidden rounded-full'
          >
            {comment.user?.avatarUrl ? (
              <img
                width={50}
                height={50}
                alt='Avatar'
                className='aspect-auto w-20 h-20 '
                src={comment.user.avatarUrl ?? ''}
              />
            ) : (
              <UserPlaceHolder className='text-sm mx-auto ' />
            )}
          </div>
          <div
            className={cn(
              'text-sm font-bold underline underline-offset-2 dark:decoration-zinc-600 decoration-zinc-300'
            )}
          >
            {comment.user.username}
          </div>
          <span className='w-1 h-1 bg-zinc-500 rounded-full' />
          <div className='text-xs text-1'>
            {new Date(comment.createdAt).toLocaleTimeString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'America/Los_Angeles'
            })}
          </div>
        </div>
        <div
          className={cn(
            !isNested
              ? `relative before:content-[''] before:absolute before:left-0 rounded-full
                     before:bg-primary before:-z-0 before:h-full before:w-[1px]`
              : '',
            'mb-4 ml-3 pl-5 relative'
          )}
        >
          {comment?.children && comment?.children?.length > 0 && (
            <Button
              variant='default'
              size='xs'
              type='button'
              onClick={() => setCommentExpanded(!isCommentExpanded)}
              className='absolute -left-[13px] bottom-0 px-0  border shadow-sm shadow-1
                   dark:border-zinc-600 rounded-full flex items-center justify-center'
            >
              {isCommentExpanded ? (
                <ChevronDownIcon fill={'bg-primary'} />
              ) : (
                <ChevronRightIcon fill={'bg-primary'} />
              )}
            </Button>
          )}
          <div className='pt-2.5'>
            {comment.message && (
              <div
                dangerouslySetInnerHTML={{
                  __html: comment.message
                }}
              />
            )}
          </div>
          <div className='pt-3 flex items-center justify-between'>
            <Muted className='text-xs'>
              {comment?.children?.length ? (
                comment?.children?.length === 1 ? (
                  <div className='flex items-center gap-1.5'>
                    <div className='text-xs font-bold'>
                      {comment?.children?.length} reply{' '}
                    </div>{' '}
                    <Button
                      type='button'
                      variant='ghost'
                      size='xs'
                      onClick={() => setReplyOpen(!isReplyOpen)}
                      className='shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1
                     dark:hover:border-zinc-500/50 rounded-full dark:bg-dark350 pl-1 pr-2.5  hover:border-zinc-300'
                    >
                      <div className='w-5 h-5 rounded text-1 flex items-center justify-center'>
                        {isReplyOpen ? <XIcon /> : <ReplyIcon />}
                      </div>
                      <div className='text-[10px] font-bold'>Reply</div>
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5'>
                    <div className='text-xs font-bold'>
                      {comment?.children?.length} replies{' '}
                    </div>{' '}
                    <Button
                      type='button'
                      variant='ghost'
                      size='xs'
                      onClick={() => setReplyOpen(!isReplyOpen)}
                      className='shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1
                     dark:hover:border-zinc-500/50 rounded-full dark:bg-dark350 pl-1 pr-2.5  hover:border-zinc-300'
                    >
                      <div className='w-5 h-5 rounded text-1 flex items-center justify-center'>
                        {isReplyOpen ? <ChevronsDownUp /> : <ReplyIcon />}
                      </div>
                      <div className='text-[10px] font-bold'>Reply</div>
                    </Button>
                  </div>
                )
              ) : (
                <LoggedIn>
                  <span className='w-1 h-1 dark:bg-zinc-600 bg-zinc-300 rounded-full mx-3' />
                  <Button
                    type='button'
                    variant='ghost'
                    size='xs'
                    onClick={() => setReplyOpen(!isReplyOpen)}
                    className='shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1
                     dark:hover:border-zinc-500/50 rounded-full dark:bg-dark350 pl-1 pr-2.5  hover:border-zinc-300'
                  >
                    <div className='w-5 h-5 rounded text-1 flex items-center justify-center'>
                      {isReplyOpen ? <ChevronsDownUp /> : <ReplyIcon />}
                    </div>
                    <div className='text-[10px] font-bold'>Reply</div>
                  </Button>
                </LoggedIn>
              )}
            </Muted>
            <Button
              type='button'
              variant='ghost'
              disabled={!user}
              size='xs'
              onClick={() => {
                setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1))
                fetcher.submit(
                  //@ts-ignore
                  {
                    commentId: comment?.id,
                    userId,
                    intent: 'like-comment'
                  },
                  { method: 'post' }
                )
              }}
            >
              {isLiked ? (
                <ThumbsUpIcon
                  className='text-primary md:size-6 size-4'
                  style={{ fill: 'currentColor' }}
                />
              ) : (
                <ThumbsUpIcon className='text-primary md:size-6 size-4' />
              )}
              <Muted className='relative top-1.5 text-xs'>{likeCount}</Muted>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='xs'
                  className='shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1'
                >
                  <MoreVerticalIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent sideOffset={19} align='center'>
                {userId === comment?.user?.id && (
                  <button
                    className='hover:dark:bg-zinc-700 hover:bg-zinc-100 rounded p-1.5'
                    onClick={() =>
                      fetcher.submit(
                        {
                          commentId: comment.id,
                          intent: 'delete-comment'
                        },
                        { method: 'post' }
                      )
                    }
                  >
                    <Trash2Icon />
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Transition
          show={isReplyOpen}
          enter='transition ease-out duration-100'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-50'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <div className='pb-5 pl-8'>
            <CommentsEditor
              isReply
              parentId={comment.id}
              //@ts-ignore
              commentDepth={comment.depth}
              postId={postId}
            />
          </div>
        </Transition>
        {comment?.children && comment?.children?.length > 0 && (
          <Transition
            show={isCommentExpanded}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <div className='pl-7'>
              {comment?.children?.map((comment, index) => (
                <CommentRow
                  key={comment.id}
                  userId={userId}
                  comment={comment}
                  comments={comments}
                  topLevelIndex={topLevelIndex}
                  postId={postId}
                  isNested
                />
              ))}
            </div>
          </Transition>
        )}
      </div>
      {!isNested && (
        <div className='border-t border-color border-dashed w-full mt-3 mb-4 ml-3' />
      )}
    </>
  )
}

export function CommentHeader({
  totalComments
}: {
  totalComments: number | undefined
}) {
  return (
    <div
      id='comments'
      className='border-y overflow-hidden border-color bg-zinc-50 shadow-sm dark:shadow dark:bg-dark350/70 relative w-full rounded-md'
    >
      <div
        className='flex items-center justify-between gap-1.5 font-bold py-3
            mx-auto pb-3'
      >
        <div className='flex items-center gap-2'>
          <ChatBubbleIcon
            name='message-circle'
            className='text-zinc-400 dark:text-zinc-500'
          />
          <div className='font-header'>
            {totalComments !== undefined && totalComments === 0
              ? 'No comments'
              : totalComments === 1
                ? '1 comment'
                : `${totalComments} comments`}
          </div>
        </div>
      </div>
      <div
        className='pattern-dots absolute left-0 top-0.5 -z-0 h-full w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10
            pattern-size-2 dark:pattern-zinc-600 dark:pattern-bg-dark350'
      />
    </div>
  )
}

function CommentsEditor({
  parentId,
  isReply,
  postId
}: {
  parentId?: string
  isReply?: boolean
  postId: string
}) {
  const { post } = useLoaderData<typeof loader>()
  const [editorContent, setEditorContent] = React.useState<string>('')
  const fetcher = useFetcher({ key: 'comments' })
  const creatingTopLevelComment = isAdding(fetcher, 'create-top-level-comment')
  const creatingReply = isAdding(fetcher, 'create-comment-reply')
  const disabled = isProcessing(fetcher.state)

  function createComment() {
    return fetcher.submit(
      {
        message: editorContent,
        intent: 'create-top-level-comment',
        postId: postId
      },
      { method: 'post' }
    )
  }
  function createCommentReply() {
    return fetcher.submit(
      //@ts-ignore
      {
        message: editorContent,
        parentId: parentId,
        postId: postId,
        intent: 'create-comment-reply'
      },
      { method: 'post' }
    )
  }

  return (
    <div className='relative rounded-xl p-4 pb-1 pr-3 border   shadow-sm '>
      <Editor
        content={editorContent}
        setContent={setEditorContent}
        postId={postId}
        post={post}
      />
      <div className=' flex items-center justify-end mt-2'>
        <Button
          type='button'
          variant='default'
          size='default'
          disabled={disabled}
          onClick={() => (isReply ? createCommentReply() : createComment())}
          className={cn(
            disabled ? 'bg-primary-foreground ' : '',
            `rounded-md w-full py-1.5 text-xs font-bold`
          )}
        >
          {creatingTopLevelComment || creatingReply ? (
            <PlusCircledIcon
              name='loader-2'
              className='mx-auto h-4 w-4 animate-spin'
            />
          ) : (
            'Comment'
          )}
        </Button>
      </div>
    </div>
  )
}
