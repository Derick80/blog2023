import { useLoaderData } from '@remix-run/react'
import type { SectionDocumentation } from '~/resources/task_tst_data'

type Props = {
  section: string
}

export default function DocumentationCard({ section }: Props) {
  const data = useLoaderData() as {
    sectionDocumentationDatas: SectionDocumentation[]
  }

  const sectionData = data.sectionDocumentationDatas.find(
    (sectionData) => sectionData.section === section
  )

  return (
    <div className='w-full'>
      <h3>{sectionData?.section}</h3>
      <ul>
        {sectionData?.tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}
