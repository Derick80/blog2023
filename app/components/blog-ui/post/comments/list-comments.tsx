import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { useFetcher, useLoaderData, useParams } from '@remix-run/react'
import CommentBox from './comment'
import { loader } from '~/routes/blog_.$postId'
import React from 'react'

const CommentList = () => {
  const { rootComments } = useLoaderData<typeof loader>()

  return (
    <ul className='[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5 space-y-2'>
      {rootComments.map((comment) => (
        <CommentBox key={comment.id} comment={comment} />
      ))}
    </ul>
  )
}

export default CommentList
