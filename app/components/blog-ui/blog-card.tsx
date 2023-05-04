import {
  Card,
  Text,
  Image,
  Group,
  TypographyStylesProvider
} from '@mantine/core'
import { Link, Form, NavLink } from '@remix-run/react'
import dayjs from 'dayjs'
import FavoriteContainer from '../favorite-container'
import LikeContainer from '../like-container'
import { ShareButton } from '../share-button'
import Tags from '../tags'
import VerticalMenu from '../vertical-menu'
import type { Post } from '~/server/schemas/schemas'
import Button from '../button'
import React from 'react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import CommentContainer from './comments/comment-list'
import { RowBox } from '../boxes'
import relativeTime from 'dayjs/plugin/relativeTime'
import applicationStyleSheet from '~/components/blog-ui/blog-card.css'
import { LinksFunction } from '@remix-run/node'
dayjs.extend(relativeTime)

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: applicationStyleSheet }]
}

export type Props = {
  post: Post
  children?: React.ReactNode
}
export default function BlogCard({ post, children }: Props) {
  const [open, setOpen] = React.useState(true)
  return (
    <div className='w-full '>
      <Card key={post.id} shadow='sm' padding='md' radius='md' withBorder>
        <Card.Section className='books relative'>
          <Image
            fit='cover'
            src={post.imageUrl}
            alt={post.title}
            height={160}
          />
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

          <div className='flex flex-grow' />
          <VerticalMenu>
            <Link to={`/blog/${post.id}`}>View</Link>
            <Link to={`/blog/${post.id}/edit`}>Edit</Link>
            <Form
              id='delete-post'
              method='POST'
              action={`/blog/${post.id}/delete`}
            >
              <button form='delete-post' type='submit'>
                Delete
              </button>
            </Form>
          </VerticalMenu>

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
        {open && <CommentContainer postId={post.id} />}
      </Card>
    </div>
  )
}
