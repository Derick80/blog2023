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
import VerticalMenu from '~/components/vertical-menu'
import Actions from '../blog-post-owner-action-container'
import { ShareButton } from '../../share-button_v2'
import FavoriteContainer from '../../favorite-container_v2'
interface BlogCardProps {
  post: Post
  children?: React.ReactNode
}

export default function BlogCard({ post, children }: BlogCardProps) {
  const [open] = React.useState(true)
  return (
    <article
      id='blog-card'
      className='hover:violet4 prose relative flex w-full  max-w-prose  border-collapse flex-col rounded-md bg-violet3 shadow-xl dark:prose-invert hover:border-2 hover:border-violet8 dark:bg-violet3_dark hover:dark:border-violet8_dark dark:hover:bg-violet4_dark'
    >
      <CardHeader title={post.title} postId={post.id} />
      <CardUpperBody
        postId={post.id}
        imageUrl={post.imageUrl}
        description={post.description}
        content={post.content}
      />
      {/* create a section divider */}
      <Separator orientation='horizontal' decorative />
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
      <FavoriteContainer postId={post.id} favorites={post.favorites} />
      <VerticalMenu>
        <Actions postId={post.id} />
      </VerticalMenu>
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
      <div className='aspect-h-4 aspect-w-3 md:aspect-h-2 md:aspect-w-3'>
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
    <div className='absolute -right-7 flex flex-col items-center justify-between gap-2 border-2 bg-violet3 dark:bg-violet3_dark '>
      <LikeContainer postId={postId} likes={likes} />
      <ShareButton id={postId} />

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
