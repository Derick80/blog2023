// BlogCard.tsx
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import React from 'react'

import CommentContainer from './blog-ui/comments/comment-list'
import type { Post } from '~/server/schemas/schemas'
import { Link, NavLink } from '@remix-run/react'
import LikeContainer from './like-container'
import FavoriteContainer from './favorite-container'
import { ShareButton } from './share-button'
import Button from './button'
import CommentBox from './blog-ui/comments/comment-box'
const dropdownVariants = {
  open: { opacity: 1, height: 'auto', transition: { duration: 1 } },
  closed: { opacity: 0, height: 0 }
}
interface Category {
  id: string
  value: string
  label: string
}

interface BlogCardProps {
  post: Post
  children?: React.ReactNode
}

export default function BlogCard({ post, children }: BlogCardProps) {
  console.log(post, 'post from blogcard')

  const [open, setOpen] = React.useState(false)
  return (
    <div className='m-3 mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-lg'>
      <div className='md:flex'>
        <div className='md:flex-shrink-0'>
          <img
            className='h-48 w-full object-contain md:w-48'
            src={post.imageUrl}
            alt={post.title}
          />
        </div>
        <div className='p-8'>
          <div className='text-sm font-semibold uppercase tracking-wide text-indigo-500'>
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <NavLink
            to={`/blog/${post.id}`}
            className='mt-1 block text-lg font-medium leading-tight text-black hover:underline'
          >
            {post.title}
          </NavLink>
          <p className='mt-2 text-gray-500'>{post.description}</p>
          <div
            className='mt-2 text-gray-500'
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
      </div>

      <div className='mt-4 p-2'>
        {post.categories.map((category) => (
          <Link to={`/blog/categories/${category.value}`} key={category.id}>
            <span
              key={category.id}
              className='mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700'
            >
              #{category.label}
            </span>
          </Link>
        ))}
      </div>
      <div className='mt-4 flex flex-row items-center gap-1'>
        <LikeContainer
          likes={post.likes}
          postId={post.id}
          likeCounts={post._count?.likes || 0}
        />
        <FavoriteContainer favorites={post.favorites} postId={post.id} />
        <ShareButton id={post.id} />
        <div className='flex flex-grow' />
        <div className='flex flex-row items-center gap-1'>
          <Button
            className='text-black'
            variant='ghost'
            size='tiny'
            onClick={() => {
              setOpen(!open)
            }}
          >
            <ChatBubbleIcon />
            <p className='text-xs text-gray-500'>{post.comments.length}</p>
          </Button>
        </div>
      </div>
      {/* Comment Section */}
      <div className='bg-gray-100 px-4 py-3'>
        <CommentBox postId={post.id} />
        <CommentContainer open={open} postId={post.id} />
      </div>
    </div>
  )
}
