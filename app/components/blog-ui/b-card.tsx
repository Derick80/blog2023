import React from 'react'
import type { Post } from '~/server/schemas/schemas'
import Button from '../button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsVerticalIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { Link, Form } from '@remix-run/react'
import { RowBox } from '../boxes'
import FavoriteContainer from '../favorite-container'
import LikeContainer from '../like-container'
import { ShareButton } from '../share-button'
import CommentContainer from './comments/comment-list'

type Props = {
  post: Post
  children?: React.ReactNode
}
export default function BlogPost({ post, children }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className='rounded-md border border-gray-200 p-4 shadow-md'
      key={post.id}
    >
      <Link to={`/blog/${post.id}`}>
        <h1 className='text-2xl font-bold'>{post.title}</h1>
      </Link>
      <img src={post.imageUrl} alt={post.title} className='w-1/2s h-1/2s' />

      <div
        className='prose mt-4 dark:prose-invert'
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <RowBox>
        <LikeContainer
          postId={post.id}
          likes={post?.likes}
          likeCounts={post?.likes?.length}
        />

        <FavoriteContainer postId={post.id} favorites={post.favorites} />
        <ShareButton id={post.id} />

        <div id='' className='flex flex-grow items-center' />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none'>
            <span className='sr-only'>Open options</span>
            <DotsVerticalIcon className='h-5 w-5' aria-hidden='true' />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className='z-10 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5'>
            <DropdownMenu.Item className='block px-4 py-2 text-sm text-black  hover:bg-gray-100'>
              <Link to={`/blog/${post.id}`}>View</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='block px-4 py-2 text-sm text-black  hover:bg-gray-100'>
              <Link to={`/blog/${post.id}/edit`}>Edit</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='block px-4 py-2 text-sm text-black  hover:bg-gray-100'>
              <Form
                id='delete-post'
                method='POST'
                action={`/blog/${post.id}/delete`}
              >
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      return true
                    } else {
                      return false
                    }
                  }}
                >
                  Delete
                </button>
              </Form>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {post.comments && (
          <>
            <div className='flex flex-row items-center gap-1'>
              <p className='sub'>{post?.comments?.length}</p>
              <Button
                variant='icon_unfilled'
                size='small'
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <ChatBubbleIcon />
              </Button>
            </div>
          </>
        )}
      </RowBox>
      {children}
      {open && <CommentContainer postId={post.id} />}
    </div>
  )
}
