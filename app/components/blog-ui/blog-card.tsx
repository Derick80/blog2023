import {
  Card,
  Text,
  Image,
  Group,
  TypographyStylesProvider
} from '@mantine/core'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { Link, Form, NavLink } from '@remix-run/react'
import dayjs from 'dayjs'
import FavoriteContainer from '../favorite-container'
import LikeContainer from '../like-container'
import { ShareButton } from '../share-button'
import Tags from '../tags'
import type { Post } from '~/server/schemas/schemas'
import Button from '../button'
import React from 'react'
import { ChatBubbleIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import CommentContainer from './comments/comment-list'
import { RowBox } from '../boxes'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export type Props = {
  post: Post
  children?: React.ReactNode
}
export default function BlogCard({ post, children }: Props) {
  const [open, setOpen] = React.useState(true)
  return (
    <Card key={post.id} shadow='xl' padding='md' radius='md' withBorder>
      <Card.Section className='books'>
        <Image fit='cover' src={post.imageUrl} alt={post.title} height={160} />
      </Card.Section>

      <Group position='apart' mt='md' mb='xs'>
        <TypographyStylesProvider>
          <NavLink to={`/blog/${post.id}`}>
            <Text size='lg' weight={700}>
              {post.title}
            </Text>
          </NavLink>
        </TypographyStylesProvider>
        <Tags categories={post.categories} />
      </Group>
      <TypographyStylesProvider>
        <Text
          color='dimmed'
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </TypographyStylesProvider>

      <Group position='apart' mt='md' mb='xs'>
        <Text size='sm' color='dimmed'>
          {post.likes.length > 0 && <>Liked by {post?.likes?.length} </>}
        </Text>
        <RowBox>
          <Text size='sm' color='dimmed'>
            {dayjs(post.createdAt).fromNow()} by
          </Text>
          <div className='flex items-center'>
            <Image
              src={post.user.avatarUrl}
              alt={post.title}
              width={24}
              height={24}
              radius='xl'
              className='mr-2'
            />
          </div>
        </RowBox>
      </Group>
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
            <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-gray-100'>
              <Link to={`/blog/${post.id}`}>View</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-gray-100'>
              <Link to={`/blog/${post.id}/edit`}>Edit</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='block px-4 py-2 text-sm  hover:bg-gray-100'>
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
            <RowBox>
              <p className='sub'>{post?.comments?.length}</p>
              <Button
                variant='ghost'
                size='tiny'
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <ChatBubbleIcon />
              </Button>
            </RowBox>
          </>
        )}
      </RowBox>
      {children}
      <CommentContainer postId={post.id} />
    </Card>
  )
}
