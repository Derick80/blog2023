import { prisma } from './prisma.server'
import type {
  Task as TaskImport,
  TaskCategory as TaskCategoryImport,
  Prisma
} from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

export type TaskCategory = SerializeFrom<TaskCategoryImport>
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

export type TaskUpdateInput = Prisma.TaskUpdateInput

export async function updateTask(
  id: string,
  input: TaskUpdateInput & { categories?: { value: string }[] }
) {
  const categories = input.categories?.map((category) => ({
    value: category.value
  }))
  return await prisma.task.update({
    where: {
      id
    },
    data: {
      ...input,
      categories: {
        set: categories
      }
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
