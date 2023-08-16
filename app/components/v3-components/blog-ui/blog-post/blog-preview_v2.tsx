import { NavLink } from '@remix-run/react'
import type { FullPost } from '~/server/schemas/schemas_v2'

export default function BlogPreviewV2({ post }: { post: FullPost }) {
  return (
    <div className='flex h-full w-full flex-col border p-1' key={post.slug}>
      <div className='flex flex-row justify-between gap-2'>
        <NavLink to={`/blog/${post.id}/`}>{post.title}</NavLink>
      </div>
      <div className='flex flex-row gap-2'>
        <div className='h-20 w-20'>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className='h-full w-full object-scale-down'
            />
          )}
        </div>
        <div className='flex flex-col gap-2'>{post.description}</div>
      </div>
      <div className='flex items-center gap-2'>
        <p className='text-sm text-gray-500 underline'>Tags</p>
        <div className='flex flex-row gap-2'>
          {post.categories?.map((tag) => (
            <NavLink
              key={tag.id}
              to={`/blog/categories/${tag.value}`}
              className='flex h-fit w-fit rounded-md border-2 p-1 text-sm text-black dark:text-white'
            >
              {tag.value}
            </NavLink>
          ))}
        </div>
      </div>
      <div className='flex flex-row justify-between gap-2'>
        <div className='flex w-full flex-row items-center'>
          {post._count?.comments ? (
            <p className='ml-2'>
              {getCommentsOrLikes(post._count?.comments, 'comment')}
            </p>
          ) : (
            <p className='ml-2'>No Comments yet...</p>
          )}
          {post._count?.likes ? (
            <>
              <p className='ml-2'>
                {getCommentsOrLikes(post._count?.likes, 'like')}
              </p>
            </>
          ) : (
            <p className='ml-2'>No Likes yet...</p>
          )}
        </div>
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
