import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { getPosts } from '~/server/post.server'
import { Form, Link, useLoaderData } from '@remix-run/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsVerticalIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { RowBox } from '~/components/boxes'
import FavoriteContainer from '~/components/favorite-container'
import LikeContainer from '~/components/like-container'
import { ShareButton } from '~/components/share-button'
import CommentContainer from '~/components/blog-ui/comments/comment-list'
import React from 'react'
import Button from '~/components/button'
import CommentBox from '~/components/blog-ui/comments/comment-box'

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())

  return json({ data })
}

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPosts()
  return json({ posts })
}

export default function BetaRoute() {
  const [open, setOpen] = React.useState(true)
  const data = useLoaderData<typeof loader>()
  return (
    <div className='flex flex-col items-center justify-center'>
      {data.posts.map((post) => (
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
                        if (
                          confirm('Are you sure you want to delete this post?')
                        ) {
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
                    variant='icon_unfilled'
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
          <CommentBox postId={post.id} />

          <CommentContainer postId={post.id} />
        </div>
      ))}
    </div>
  )
}
