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
      published: true,
      user: {
        connect: {
          id: data.userId
        }
      },
      categories: {
       connect: data.categories.map((category) => ({
          value: category.value,

        }))
      }
    }
  })
  return post
}

export async function updatePost(data: PostInput & { postId: string }) {
  const post = await prisma.post.update({
    where: {
      id: data.postId
    },
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
      set: data.categories.map((category) => ({
          value: category.value,
          
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
          _count: true,
          likes: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatarUrl: true
            }
          },
          children: {
            include: {
              user: true,
              children: true,
              likes: true
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
