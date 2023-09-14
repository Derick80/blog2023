import { useFetcher } from '@remix-run/react'
import React from 'react'
import { CommentWithChildren } from '~/server/schemas/schemas'

export type CommentListProps = {
  postId: string
}

export default function CommentList({ postId }: CommentListProps) {
  const commentFetcher = useFetcher()

  React.useEffect(() => {
    if (commentFetcher.state === 'idle' && commentFetcher.data === undefined) {
      commentFetcher.load(`/blog/${postId}/comment`)
    }
  })

  const data = commentFetcher?.data as {
    comments: CommentWithChildren[]
  }
  console.log('data', data)
  //   create a function that looks for comments that have a parentId that is not null and then nest them under the parent comment.

  const organizedComments = data?.comments?.reduce(
    (acc: CommentWithChildren[], comment: CommentWithChildren) => {
      if (comment.parentId === null) {
        acc.push(comment)
      } else {
        const parentComment = acc.find((c) => c.id === comment.parentId)
        if (parentComment) {
          if (parentComment.children) {
            parentComment.children.push(comment)
          } else {
            parentComment.children = [comment]
          }
        }
      }
      return acc
    },
    []
  )
  console.log('organizedComments', organizedComments)

  const parentComments = data?.comments?.filter(
    (comment: CommentWithChildren) => comment.parentId === null
  )

  console.log('parentComments', parentComments)

  return (
    <div className='flex flex-col gap-1 rounded-md pl-2'>
      {organizedComments?.map((comment: CommentWithChildren) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  return (
    <div>
      <p>{comment.message}</p>
      {comment.children?.map((child) => (
        <div key={child.id}>
          <p>{child.message} child</p>
        </div>
      ))}
    </div>
  )
}

const tstData = [
  {
    id: 'ab1adfac-9b97-4898-b18d-a3a4a3af09c7',
    message: 'Lots of comment testing to be done',
    createdAt: '2023-08-01T18:07:28.249Z',
    updatedAt: '2023-08-01T18:07:28.249Z',
    createdBy: 'DerickH',
    userId: 'clh7pg2rj000065b35wvqge8d',
    postId: 'clkm6bv39000065e7teeq4s06',
    parentId: null,
    user: {
      id: 'clh7pg2rj000065b35wvqge8d',
      username: 'DerickH',
      email: 'iderick@gmail.com',
      avatarUrl:
        'https://res.cloudinary.com/dch-photo/image/upload/v1681939465/dhcxf2eqqrbvpnxmrqhb.jpg',
      role: 'USER'
    }
  },
  {
    id: '37125993-f799-48a4-bd6a-79d8bc6bd63a',
    message: 'You can do it!',
    createdAt: '2023-08-01T18:08:36.965Z',
    updatedAt: '2023-08-01T18:08:36.965Z',
    createdBy: 'DerickH',
    userId: 'clh7pg2rj000065b35wvqge8d',
    postId: 'clkm6bv39000065e7teeq4s06',
    parentId: 'ab1adfac-9b97-4898-b18d-a3a4a3af09c7',
    user: {
      id: 'clh7pg2rj000065b35wvqge8d',
      username: 'DerickH',
      email: 'iderick@gmail.com',
      avatarUrl:
        'https://res.cloudinary.com/dch-photo/image/upload/v1681939465/dhcxf2eqqrbvpnxmrqhb.jpg',
      role: 'USER'
    }
  },
  {
    id: 'a7e7b9a2-7ce3-46b4-80cf-88aa731f3d06',
    message: 'A new parent test comment',
    createdAt: '2023-08-01T18:08:54.945Z',
    updatedAt: '2023-08-01T18:08:54.945Z',
    createdBy: 'DerickH',
    userId: 'clh7pg2rj000065b35wvqge8d',
    postId: 'clkm6bv39000065e7teeq4s06',
    parentId: null,
    user: {
      id: 'clh7pg2rj000065b35wvqge8d',
      username: 'DerickH',
      email: 'iderick@gmail.com',
      avatarUrl:
        'https://res.cloudinary.com/dch-photo/image/upload/v1681939465/dhcxf2eqqrbvpnxmrqhb.jpg',
      role: 'USER'
    }
  },
  {
    id: '2000aa68-f1be-43f7-a446-0bd436e08e64',
    message: 'a new comment',
    createdAt: '2023-09-12T03:26:11.844Z',
    updatedAt: '2023-09-12T03:26:11.844Z',
    createdBy: 'Grayone',
    userId: 'clh7n2qsm0000jqg62z54fymz',
    postId: 'clkm6bv39000065e7teeq4s06',
    parentId: null,
    user: {
      id: 'clh7n2qsm0000jqg62z54fymz',
      username: 'Grayone',
      email: 'derickchoskinson@gmail.com',
      avatarUrl:
        'https://res.cloudinary.com/dch-photo/image/upload/v1681942247/etaaeiiliaxrf86kza0i.jpg',
      role: 'ADMIN'
    }
  }
]
