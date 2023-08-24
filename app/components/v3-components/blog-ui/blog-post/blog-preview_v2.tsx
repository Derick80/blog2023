import {
  ChatBubbleIcon,
  ExitIcon,
  OpenInNewWindowIcon
} from '@radix-ui/react-icons'
import { Form, Link, NavLink } from '@remix-run/react'
import type {
  Category_v2,
  Favorite_v2,
  FullPost,
  Like_v2
} from '~/server/schemas/schemas_v2'
import LikeContainer from '../like-container-v2'
import * as HoverCard from '@radix-ui/react-hover-card'
import clsx from 'clsx'
import { formatDateAgo, useOptionalUser } from '~/utilities'
import { ShareButton } from '../../share-button_v2'
import type { User } from '~/server/schemas/schemas'
import BlogPostOwnerAction from '../blog-post-owner-action-container'
import FavoriteContainer from '../../favorite-container_v2'
import Button from '~/components/button'

export default function BlogPreviewV2({ post }: { post: FullPost }) {
  // I used w-[65ch] rather than max-w-prose because I wanted to have a uniform width for all cards
  const currentUser = useOptionalUser()

  const isPostOwner = currentUser?.id === post.userId
  return (
    <article
      className='prose flex w-[65ch] transform  flex-col  rounded-md border  bg-violet3 shadow-xl transition  duration-500 ease-in-out dark:prose-invert hover:-translate-y-1 hover:scale-110 hover:shadow-2xl dark:bg-violet3_dark hover:dark:border-violet8_dark dark:hover:bg-violet8_dark  '
      key={post.slug}
    >
      <CardHeader title={post.title} postId={post.id} />

      <CardUpperBody
        postId={post.id}
        imageUrl={post.imageUrl}
        description={post.description}
        content={post.content}
        categories={post.categories}
      />

      <CardFooter
        isPostOwner={isPostOwner}
        postId={post.id}
        counts={post._count}
        likes={post.likes}
        user={post.user}
        updatedAt={post.updatedAt}
        favorites={post.favorites}
      />
    </article>
  )
}

// card headers

function CardHeader({ title, postId }: { title: string; postId: string }) {
  return (
    <div className='flex flex-row items-center justify-between gap-2'>
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
  content,
  categories
}: {
  postId: string
  imageUrl: string
  description: string
  content: string
  categories: Category_v2[]
}) {
  return (
    <div className='flex max-h-96 w-full'>
      <div className='w-1/3 flex-shrink-0'>
        <div
          className='h-full w-full bg-cover bg-center'
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
      </div>
      <div className='flex w-2/3 flex-wrap p-4'>
        <NavLink
          className='mb-2 flex items-center gap-1 text-lg font-bold italic leading-4 hover:underline'
          to={`/blog/${postId}`}
        >
          {description} <OpenInNewWindowIcon />
        </NavLink>
        <div
          className='prose line-clamp-2 max-w-prose text-base leading-7 dark:prose-invert'
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* create a readmore link */}
        <NavLink
          to={`/blog/${postId}`}
          className='flex gap-1 text-sm font-semibold leading-4 hover:underline'
        >
          Read More <OpenInNewWindowIcon />
        </NavLink>
      </div>
    </div>
  )
}

// card lower body  I might not use this

function CardLowerBody({
  postId,
  categories,
  user
}: {
  postId: string
  categories: Category_v2[]
  user: User
}) {
  return (
    <div className='mt-1 flex flex-row gap-2 '>
      <CategoryContainer categories={categories} />
    </div>
  )
}
// category container
export function CategoryContainer({
  categories,
  className
}: {
  categories: Category_v2[]
  className?: string
}) {
  return (
    <div className='flex flex-row flex-wrap items-center gap-1 p-1'>
      {categories.map((category) => {
        return (
          <Link
            key={category.id}
            to={`/blog/categories/${category.value}`}
            className={clsx(
              'focus-ring dark:bg-violet3j_dark dark:hover:bg-violet4j_dark mr- relative mb-2 block h-auto w-auto cursor-pointer rounded-full bg-violet3 px-4  py-2 text-violet12 no-underline opacity-100 transition dark:bg-violet3_dark dark:text-slate-50',
              className
            )}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}

// card footer

function CardFooter({
  postId,
  updatedAt,
  counts,
  likes,
  user,
  favorites,
  isPostOwner
}: {
  postId: string
  likes: Like_v2[]
  counts: {
    comments: number
    likes: number
    favorites: number
  }
  updatedAt: string
  user: User
  favorites: Favorite_v2[]
  isPostOwner: boolean
}) {
  return (
    <div className='flex  flex-row justify-between gap-2 '>
      <div className='flex flex-row items-center gap-1'>
        <p className='text-[15px]'>posted by</p>
        <UserInfoHoverCard user={user} />
        <p className='text-[15px]'> {formatDateAgo(updatedAt)}</p>
      </div>
      <div className='flex flex-row items-center gap-1'>
        {isPostOwner && <BlogPostOwnerAction postId={postId} />}

        <ShareButton id={postId} />
        <FavoriteContainer postId={postId} favorites={favorites} />
      </div>
      <div className='flex flex-row items-center gap-1'>
        <LikeContainer postId={postId} likes={likes} />
        <NavLink
          className='flex flex-row items-center gap-1'
          to={`/blog/${postId}`}
        >
          <ChatBubbleIcon />
          <p className='text-[15px]'>{counts.comments}</p>
        </NavLink>
      </div>
    </div>
  )
}

export type HoverCardProps = {
  user: User
}

export function UserInfoHoverCard({ user }: HoverCardProps) {
  const { avatarUrl, username, email, id } = user

  return (
    <>
      <HoverCard.Root openDelay={200} closeDelay={200}>
        <HoverCard.Trigger>
          <img
            src={avatarUrl || ''}
            alt={`${username}'s avatar`}
            className='h-8 w-8 rounded-full'
          />
        </HoverCard.Trigger>
        <HoverCard.Content sideOffset={5} align='center' side='top'>
          <div className='w-50 rounded-md bg-violet1 p-5 shadow-md dark:bg-violet3_dark'>
            <div className='justify-cnter flex flex-col items-center'>
              <img
                src={avatarUrl || ''}
                alt={`${username}'s avatar`}
                className='h-8 w-8 rounded-full'
              />
              <Link
                title={`Click here to view ${username}'s profile`}
                to={`/users/${username}`}
                className='text-lg font-semibold text-gray-800 dark:text-gray-100'
              >
                <h6>{username}</h6>
              </Link>

              <p className='text- text-violet12 dark:text-violet12_dark'>
                {email}
              </p>
              {id && (
                <>
                  <Button size='small' variant='primary_filled'>
                    <Link
                      title='Click here to edit your user profile'
                      to={`/users/${username}/edit`}
                    >
                      Edit Profile
                    </Link>
                  </Button>
                  <Form
                    className='m-0 flex items-center justify-center p-1'
                    method='POST'
                    action='/logout'
                  >
                    <Button
                      title='Click here to logout of your DerickcHoskinson.com account'
                      variant='icon_unfilled'
                      size='small'
                    >
                      <ExitIcon />
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    </>
  )
}
