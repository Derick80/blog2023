import { NavLink } from '@remix-run/react'
import type { Category_v2 } from '~/server/schemas/schemas_v2'

export default function CategoryContainer({
  categories
}: {
  categories: Category_v2[]
}) {
  return (
    <div className='flex flex-row items-center gap-2 border-b-2 border-t-2 p-1'>
      {categories.map((category) => {
        return (
          <NavLink
            key={category.id}
            to={`/blog/categories/${category.value}`}
            className='rounded-md border p-1 text-xs font-semibold leading-4 hover:underline'
          >
            #{category.label}
          </NavLink>
        )
      })}
    </div>
  )
}
