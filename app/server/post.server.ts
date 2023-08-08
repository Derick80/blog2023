import { prisma } from './prisma.server'
import type { Category, CategoryForm, Post, User } from './schemas/schemas'

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
          value: category.value
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
          value: category.value
        }))
      }
    }
  })

  return post
}

export async function getInitialPosts() {
  return await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          password: false,
          role: true
        }
      },
      _count: {
        select: {
          comments: true,
          likes: true
        }
      },

      likes: false,
      favorites: false,
      categories: true,
      comments: false
    },

    orderBy: {
      createdAt: 'desc'
    }
  })
}



export async function getPostsVersionTwo() {
  return await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          password: false,
          role: true
        }
      },
      _count: {
        select: {
          comments: true,
          likes: true
        }
      },

      likes: false,
      favorites: false,
      categories: true,
      comments: false
    },

    orderBy: {
      createdAt: 'desc'
    }
  })
}
export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          password: false,
          role: true
        }
      },
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
              avatarUrl: true,
              password: false,
              role: true
            }
          },
          children: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                  password: false,
                  role: false
                }
              },
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

export async function getUserPosts(username: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      user: {
        username
      }
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          password: false,
          role: true
        }
      },
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
              avatarUrl: true,
              password: false,
              role: true
            }
          },
          children: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                  password: false,
                  role: false
                }
              },
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
}
