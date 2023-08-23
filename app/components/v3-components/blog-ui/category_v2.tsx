import { NavLink } from '@remix-run/react'
import clsx from 'clsx'
import type { Category_v2 } from '~/server/schemas/schemas_v2'

export default function CategoryContainer({
  categories,
  className
}: {
  categories: Category_v2[]
  className?: string
}) {
  return (
    <div className='flex flex-row flex-wrap items-center gap-2  p-1'>
      {categories.map((category) => {
        return (
          <NavLink
            key={category.id}
            to={`/blog/categories/${category.value}`}
            className={clsx(
              'focus-ring dark:bg-violet3j_dark dark:hover:bg-violet4j_dark relative mb-4 mr-4 block h-auto w-auto  cursor-pointer rounded-full bg-violet3  px-6 py-3 text-violet12 opacity-100 transition dark:bg-violet3_dark dark:text-slate-50',
              className
            )}
          >
            {category.label}
          </NavLink>
        )
      })}
    </div>
  )
}
