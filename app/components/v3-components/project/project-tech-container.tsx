import { Category_v2 } from '~/server/schemas/schemas_v2'

export default function TechnologiesContainer({
  categories
}: {
  categories: Category_v2[]
}) {
  return (
    <div className='flex flex-col flex-wrap items-center gap-2  p-1'>
      <h2>Technologies</h2>
      <div className='flex flex-row flex-wrap items-center gap-2  p-1'>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className='rounded-md border p-1 text-xs font-semibold leading-4 hover:border-2 hover:border-violet7 dark:hover:border-violet7_dark'
            >
              {category.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
