import { prisma } from './auth/prisma.server'
import type { CategoryForm } from './schemas/schemas'

export type PostInput = {
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  featured: boolean
  userId: string
  categories: CategoryForm
}
export async function createPost(data: PostInput) {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      featured: data.featured,
      user: {
        connect: {
          id: data.userId
        }
      },
      categories: {
        connectOrCreate: data.categories.map((category) => ({
          where: {
            value: category.value
          },
          create: {
            value: category.value,
            label: category.value
          }
        }))
      }
    }
  })
  return post
}

export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true,
      comments: {
        include: {
          user: true,
          children: {
            include: {
              user: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return posts
}
