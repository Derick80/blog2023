import {
  Card,
  Text,
  Image,
  Group,
  TypographyStylesProvider,
  Avatar
} from '@mantine/core'
import { Link, Form } from '@remix-run/react'
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

dayjs.extend(relativeTime)

export type Props = {
  post: Post
  children?: React.ReactNode
}
export default function BlogCard({ post, children }: Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='w-full'>
      <Card key={post.id} shadow='sm' padding='md' radius='md' withBorder>
        <Card.Section className='relative'>
          <Image
            fit='cover'
            src={post.imageUrl}
            alt={post.title}
            height={160}
          />
        </Card.Section>

        <Group position='apart' mt='md' mb='xs'>
          <TypographyStylesProvider>
            <Text weight={500}>{post.title}</Text>
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
            <Avatar
              className=''
              src={post.user.avatarUrl}
              size='sm'
              radius='xl'
            />
          </RowBox>
        </Group>
        <Group position='apart' mt='md' mb='xs'>
          <Group position='left' mt='xs' mb='xs'>
            {post.likes.length > 0 && (
              <LikeContainer
                postId={post.id}
                likes={post.likes}
                likeCounts={post?.likes?.length}
              />
            )}
            <FavoriteContainer postId={post.id} favorites={post.favorites} />
            <ShareButton id={post.id} />
          </Group>
          <Group position='right' mt='xs' mb='xs'>
            <VerticalMenu>
              <Link to={`/blog/${post.id}`}>View</Link>
              <Link to={`/blog/${post.id}/edit`}>Edit</Link>
              <Form method='post' action={`/blog/${post.id}/delete`}>
                <button type='submit'>Delete</button>
              </Form>
            </VerticalMenu>

            {post.comments && (
              <>
                <RowBox>
                  <p className='sub'>{post.comments.length}</p>
                  <Button
                    variant='ghost'
                    size='tiny'
                    onClick={() => {
                      setOpen(!open)
                    }}
                  >
                    <ChatBubbleIcon />{' '}
                  </Button>
                </RowBox>
              </>
            )}
          </Group>
        </Group>
        {children}
        {open && <CommentContainer postId={post.id} />}
      </Card>
    </div>
  )
}
