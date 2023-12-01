import type { Task as TaskImport } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

export type Sections = SerializeFrom<SectionDoc>
export type Tasks = SerializeFrom<TaskImport>

export type SectionDocumentation = {
  id: string
  section: string
  createdAt: string
  updatedAt: string
  tasks: {
    id: string
    title: string
    description: string
    status: string
    createdAt: string
    updatedAt: string
    sectionId: string
  }[]
}

export const sectionDocumentationData: SectionDocumentation[] = [
  {
    id: '1',
    section: 'Home',
    createdAt: '2021-08-10T00:00:00.000Z',
    updatedAt: '2021-08-10T00:00:00.000Z',
    tasks: [
      {
        id: '1',
        title: 'Home Page',
        description: 'Improvments to the Home Page',
        status: 'IN_PROGRESS',
        createdAt: '2021-08-10T00:00:00.000Z',
        updatedAt: '2021-08-10T00:00:00.000Z',
        sectionId: '1'
      }
    ]
  },
  {
    id: '2',
    section: 'About',
    createdAt: '2021-08-10T00:00:00.000Z',
    updatedAt: '2021-08-10T00:00:00.000Z',
    tasks: [
      {
        id: '1',
        title: 'About Page Design and Layout',
        description: 'About Page',
        status: 'IN_PROGRESS',
        createdAt: '2021-08-10T00:00:00.000Z',
        updatedAt: '2021-08-10T00:00:00.000Z',
        sectionId: '2'
      },
      {
        id: '2',
        title: 'About Page Content',
        description: 'About Page Content needs to be written',
        status: 'IN_PROGRESS',
        createdAt: '2021-08-10T00:00:00.000Z',
        updatedAt: '2021-08-10T00:00:00.000Z',
        sectionId: '2'
      }
    ]
  },
  {
    id: '3',
    section: 'Resume',
    createdAt: '2021-08-10T00:00:00.000Z',
    updatedAt: '2021-08-10T00:00:00.000Z',
    tasks: [
      {
        id: '1',
        title: 'Resume Page Design and Layout',
        description: 'Resume Page',
        status: 'IN_PROGRESS',
        createdAt: '2021-08-10T00:00:00.000Z',
        updatedAt: '2021-08-10T00:00:00.000Z',
        sectionId: '3'
      }
    ]
  }
]
