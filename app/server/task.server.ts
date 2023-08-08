import { prisma } from './prisma.server'
import { Prisma } from '@prisma/client'
import type {
  Task as TaskImport,
  TaskCategory as TaskCategoryImport
} from '@prisma/client'

export type TaskCategory = TaskCategoryImport
export type Task = TaskImport & {
  categories: TaskCategory[]
}
export async function getTaskCategories() {
  return await prisma.taskCategory.findMany({
    distinct: ['value']
  })
}

export async function getTasks({ filter }: { filter?: string }) {
  if (filter) {
    return await prisma.task.findMany({
      where: {
        ...filter
      },
      include: {
        categories: true
      }
    })
  } else {
    return await prisma.task.findMany({
      include: {
        categories: true
      }
    })
  }
}

export async function getTask(id: string) {
  return await prisma.task.findUnique({
    where: {
      id
    },
    include: {
      categories: true
    }
  })
}

export async function deleteTask(id: string) {
  return await prisma.task.delete({
    where: {
      id
    }
  })
}

export async function addTaskCategory(value: string) {
  return await prisma.taskCategory.create({
    data: {
      value,
      label: value
    }
  })
}

export async function updateTaskStatus(taskId: string, status: string) {
  return await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      status: status
    }
  })
}

export async function createTask(input: Prisma.TaskCreateInput) {
  return await prisma.task.create({
    data: input
  })
}
