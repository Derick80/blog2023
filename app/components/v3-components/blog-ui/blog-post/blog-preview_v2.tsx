import { ChatBubbleIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { NavLink } from '@remix-run/react'
import type {
  Category_v2,
  FullPost,
  Like_v2
} from '~/server/schemas/schemas_v2'
import LikeContainer from '../like-container-v2'
import CategoryContainer from '../category_v2'

export default function BlogPreviewV2({ post }: { post: FullPost }) {
  console.log(post.categories, 'post categories')

  return (
    <article
      className='w-full max-w-prose transform overflow-hidden rounded-md border shadow-xl transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl  '
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
      <CategoryContainer categories={post.categories} />

      <CardFooter postId={post.id} counts={post._count} likes={post.likes} />
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
    <div className='flex max-h-96'>
      <div className='w-1/3 flex-shrink-0'>
        <div
          className='h-full w-full bg-cover bg-center'
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
      </div>
      <div className='flex-grow p-4'>
        <NavLink
          className='mb-2 flex items-center gap-1 text-lg font-bold italic leading-4 hover:underline'
          to={`/blog/${postId}`}
        >
          {description} <OpenInNewWindowIcon />
        </NavLink>
        <div
          className='prose line-clamp-2 text-base leading-7 dark:prose-invert'
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

// card Actions

// card footer

function CardFooter({
  postId,
  counts,
  likes
}: {
  postId: string
  likes: Like_v2[]
  counts: {
    comments: number
    likes: number
    favorites: number
  }
}) {
  return (
    <div className='flex  flex-row justify-end gap-2 '>
      <LikeContainer postId={postId} likes={likes} />
      <NavLink
        className='flex flex-row items-center gap-1'
        to={`/blog/${postId}`}
      >
        <ChatBubbleIcon />
        <p className='text-[15px]'>{counts.comments}</p>
      </NavLink>
    </div>
  )
}
