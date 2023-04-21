import { NavLink } from '@remix-run/react'
import { Post } from '~/server/schemas/schemas'

export default function Tags({
  categories
}: {
  categories: Post['categories']
}) {
  return (
    <div className='flex flex-row gap-1 p-1'>
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
  )
}
