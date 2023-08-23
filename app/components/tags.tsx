import { NavLink } from '@remix-run/react'
import type { Post } from '~/server/schemas/schemas'

export default function Tags({
  categories
}: {
  categories: Post['categories']
}) {
  return (
    <div className='flex flex-row gap-1'>
      {categories.map((category) => (
        <NavLink
          to={`/blog/categories/${category.value}`}
          className='rounded-md border-2 bg-slate-900 p-1 text-xs text-violet3 dark:bg-slate-50 dark:text-black'
          key={category.id}
        >
          {category.value}
        </NavLink>
      ))}
    </div>
  )
}
