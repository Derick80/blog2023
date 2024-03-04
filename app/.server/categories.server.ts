import { json } from '@remix-run/node'
import { prisma } from './prisma.server'
import { categorySeed } from 'prisma/seed'

export async function seedCategories() {
  return await prisma.category.createMany({
    data: categorySeed
  })
}

export async function createCategory({
  title,
  postId,
  userId
}: {
  title: string
  postId: string
  userId: string
}) {
  const parsedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const categoryExists = await prisma.category.findUnique({
    where: { value: parsedTitle }
  })
  if (categoryExists) throw new Error('Category already exists')
  const category = await prisma.post.update({
    where: {
      id: postId,
      userId: userId
    },
    data: {
      categories: {
        connectOrCreate: {
          where: {
            value: parsedTitle
          },
          create: {
            value: parsedTitle,
            label: title
          }
        }
      }
    }
  })
  if (!category) throw new Error('Category not created')
  return json({ category })
}

export async function addCategoryToPost({
  postId,
  userId,
  categoryId
}: {
  postId: string
  userId: string
  categoryId: string
}) {
  const category = await prisma.post.update({
    where: {
      id: postId,
      userId: userId
    },
    data: {
      categories: {
        connect: {
          id: categoryId
        }
      }
    },
    select: {
      categories: true
    }
  })
  if (!category) throw new Error('Category not added to post')
  return json({ category })
}

export async function removeCategoryFromBlogPost({
  postId,
  userId,
  categoryId
}: {
  postId: string
  userId: string
  categoryId: string
}) {
  const category = await prisma.post.update({
    where: {
      id: postId,
      userId: userId
    },
    data: {
      categories: {
        disconnect: {
          id: categoryId
        }
      }
    },
    select: {
      categories: true
    }
  })
  if (!category) throw new Error('Category not removed from post')
  return json({ category })
}
