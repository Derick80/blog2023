import { Post } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'
import { Link, NavLink } from '@remix-run/react'
import Tags from '~/components/tags'
import type { Category, User } from '~/server/schemas/schemas'
import { formatDateAgo } from '~/utilities'

type BlogPreviewCardProps = SerializeFrom<
  Post & {
    user: User
    categories: Category[]
    _count: {
      comments: number
      likes: number
    }
  }
>

export default function BlogPreviewCard({
  posts
}: {
  posts: BlogPreviewCardProps
}) {
  const { id, title, description, createdAt, user, categories, _count } = posts

  return (
    <div className='flex w-full flex-col rounded-md bg-slate-200 p-1 dark:bg-slate-800 md:p-2 lg:p-3'>
      <Link to={`/blog/${id}`}>
        <h4>{title}</h4>
      </Link>
      <NavLink to={`/blog/users/${user.username}`}>
        <p className='text-sm text-slate-50 dark:text-gray-400'>
          Posted by {user.username} {formatDateAgo(createdAt)}
        </p>
      </NavLink>

      <p>{description}</p>
      <Tags categories={categories} />

      <div className='flex w-full flex-row items-center'>
        {_count?.comments > 0 ? (
          <p className='ml-2'>
            {getCommentsOrLikes(_count?.comments, 'comment')}
          </p>
        ) : (
          <p className='ml-2'>No Comments yet...</p>
        )}
        {_count?.likes > 0 ? (
          <>
            <p className='ml-2'>{getCommentsOrLikes(_count?.likes, 'like')}</p>
          </>
        ) : (
          <p className='ml-2'>No Likes yet...</p>
        )}
      </div>
    </div>
  )
}

// write a function that takes in the number of comments or likes and returns a string with the number and the word comments or likes

function getCommentsOrLikes(count: number, type: 'comment' | 'like') {
  if (count === 0) {
    return ''
  }

  if (count === 1) {
    return `${count} ${type}`
  }

  return `${count} ${type}s`
}
