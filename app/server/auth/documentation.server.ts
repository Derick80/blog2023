import { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'

export async function getDocumentation() {
  const documentationData = await prisma.sectionDocumentation.findMany({
    include: {
      tasks: true
    }
  })
  const sectionDocumentationData: {
    [key: string]: (typeof documentationData)[0]
  } = documentationData.reduce(
    (acc, sectionDoc) => {
      if (acc[sectionDoc.section]) {
        acc[sectionDoc.section].tasks.push(...sectionDoc.tasks)
      } else {
        acc[sectionDoc.section] = {
          ...sectionDoc,
          tasks: [...sectionDoc.tasks]
        }
      }
      return acc
    },
    {} as {
      [key: string]: (typeof documentationData)[0]
    }
  )
  return sectionDocumentationData
}

type CreateTask = {
  title: string
  description: string
  status: string
  section: string
}
export async function createTask(input: CreateTask) {
  return await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      section: {
        connectOrCreate: {
          where: {
            section: input.section
          },
          create: {
            section: input.section
          }
        }
      }
    }
  })
}
