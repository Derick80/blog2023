import { Badge } from '~/components/ui/badge'

export default function TechnologiesContainer({
  categories
}: {
  categories: string[]
}) {
  return (
    <div className='flex flex-row flex-wrap items-center gap-2  p-1'>
      {categories.map((category) => {
        return <Badge key={category}>{category}</Badge>
      })}
    </div>
  )
}
