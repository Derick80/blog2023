import { Comment, CommentWithChildren } from '~/server/schemas/schemas'
import { useFetcher, useLoaderData, useParams } from '@remix-run/react'
import CommentBox from './comment'
import React from 'react'
import { loader } from '~/routes/blog_.$postId'

type CommentListProps = {
  comment: Comment & {
    children?: Comment[]
  }
}

const CommentList = ({ comment }: CommentListProps) => {
  const postId = useParams().postId
  if (!postId) return null

  const { comments } = useLoaderData<typeof loader>()

  const commentList = comments?.filter((c) => !c.parentId)

  return (
    <>
      <ul className='[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5 space-y-2'>
        <CommentBox comment={comment} />
      </ul>
    </>
  )
}

export default CommentList
