// BlogCard.tsx

import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Link, NavLink } from '@remix-run/react'
import React from 'react'
import type { Post } from '~/server/schemas/schemas'
import type { Like_v2 } from '~/server/schemas/schemas_v2'
import LikeContainer from '../like-container-v2'
import CommentBox from '~/components/comments/comment-box'
import CommentContainer from '~/components/comments/comment-list'
import { Separator } from '@radix-ui/react-separator'

interface BlogCardProps {
  post: Post
  children?: React.ReactNode
}

export default function BlogCard({ post, children }: BlogCardProps) {
  const [open, setOpen] = React.useState(true)
  return (
    <article className='prose relative flex w-full max-w-prose  flex-col  rounded-md  shadow-xl dark:prose-invert '>
      <CardHeader title={post.title} postId={post.id} />
      <CardUpperBody
        postId={post.id}
        imageUrl={post.imageUrl}
        description={post.description}
        content={post.content}
      />
      {/* create a section divider */}
      <Separator orientation='horizontal' decorative className='bg-teal-500' />
      <div className='flex flex-wrap justify-start'>
        {post.categories.map((category) => (
          <Link to={`/blog/categories/${category.value}`} key={category.id}>
            <span
              key={category.id}
              className='mb-1 mr-2 mt-1 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700'
            >
              #{category.label}
            </span>
          </Link>
        ))}
      </div>
      <div id='comments' className=''>
        <CommentBox postId={post.id} />
        <CommentContainer postId={post.id} open={open} />
      </div>
      <CardSideMenu postId={post.id} counts={post._count} likes={post.likes} />
    </article>
  )
}

function CardHeader({ title, postId }: { title: string; postId: string }) {
  return (
    <div className='flex w-full flex-row items-center justify-between gap-2'>
      <NavLink
        to={`/blog/${postId}`}
        className='p-1 pl-0 text-xl font-semibold leading-4 hover:underline'
      >
        {title}
      </NavLink>
    </div>
  )
}

// card body

function CardUpperBody({
  postId,
  imageUrl,
  description,
  content
}: {
  postId: string
  imageUrl: string
  description: string
  content: string
}) {
  return (
    <div className='flex-grow'>
      <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
        <img src={imageUrl} alt={description} className='h-96 w-96' />
      </div>
      <div
        className='prose indent-2 text-base leading-7 dark:prose-invert'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

// card footer

function CardSideMenu({
  postId,
  counts,
  likes
}: {
  postId: string
  counts: {
    comments: number
    likes: number
  }
  likes: Like_v2[]
}) {
  return (
    <div className='absolute -right-7 flex flex-col items-center gap-2 border-2 bg-gray-400 '>
      <LikeContainer postId={postId} likes={likes} />
      <NavLink
        className='flex flex-row items-center gap-1'
        to={`/blog/${postId}`}
      >
        <NavLink className='flex flex-row items-center gap-1' to='#comments'>
          <ChatBubbleIcon />
          <p className='text-[15px]'>{counts?.comments}</p>
        </NavLink>
      </NavLink>
    </div>
  )
}
