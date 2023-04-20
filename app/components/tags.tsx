import { NavLink } from '@remix-run/react'
import { Post } from '~/server/schemas/post-schema'

export default function Tags({
  categories
}: {
  categories: Post['categories']
}) {
  return (
    <div className='flex flex-row gap-2 border-2 border-purple-500  p-1'>
      <div className='flex flex-row gap-2'>
        {categories.map((category) => (
          <NavLink
            to={`/blog/${category.value}`}
            className='rounded-md border-2 p-1 text-xs'
            key={category.id}
          >
            {category.value}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
