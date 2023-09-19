import { useFetcher, useParams } from '@remix-run/react'
import React from 'react'
import { CommentWithChildren } from '~/server/schemas/schemas'
import formComments from './formatComments'
import CommentForm from './comment-form_v2'
import ListComments from './list-comments'

export type CommentSectionProps = {
  postId: string
}
export default function CommentSection({ postId }: CommentSectionProps) {
  const params = useParams()
  console.log(params, 'params from comment section')

  const commentFetcher = useFetcher()
  let isDone = commentFetcher.state === 'idle' && commentFetcher.data != null

  React.useEffect(() => {
    if (
      (commentFetcher.state === 'idle' && commentFetcher.data === undefined) ||
      commentFetcher.data === null
    ) {
      commentFetcher.load(`/actions/comment/${postId}`)
    }
  }, [commentFetcher, postId, isDone])

  const data = commentFetcher?.data?.postComments as CommentWithChildren[]

  if (!data) return null

  return (
    <div className='flex flex-col gap-1 md:gap-2 lg:gap-3'>
      <CommentForm />
      {data && <ListComments comments={formComments(data)} />}
    </div>
  )
}
