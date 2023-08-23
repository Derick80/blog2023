import { prisma } from './prisma.server'
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
      _count: {
        select: {
          comments: true,
          likes: true,
          favorites: true
        }
      },
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

export const DefaultUserSelect = {
  id: true,
  username: true,
  email: true,
  avatarUrl: true,
  password: false,
  role: true
}

export const DefaultCommentSelect = {
  id: true,
  message: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: DefaultUserSelect
  }
}

export const DefaultLikeSelect = {
  userId: true,
  postId: true
}

export const DefaultFavoriteSelect = {
  userId: true,
  postId: true
}

export const DefaultAllPostSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  imageUrl: true,
  featured: true,
  published: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: DefaultUserSelect
  },
  categories: true,
  _count: {
    select: {
      comments: true,
      likes: true,
      favorites: true
    }
  },
  likes: {
    select: DefaultLikeSelect
  },
  favorites: {
    select: DefaultFavoriteSelect
  }
}

export async function getAllPostsV1(take?: number) {
  if (take) {
    return await prisma.post.findMany({
      select: {
        ...DefaultAllPostSelect
      },
      take,
      orderBy: {
        createdAt: 'desc'
      }
    })
  } else {
    return await prisma.post.findMany({
      select: {
        ...DefaultAllPostSelect
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}

export async function getAllPostsV1WithFilter(filter: string) {
  return await prisma.post.findMany({
    select: {
      ...DefaultAllPostSelect
    },
    where: {
      OR: [
        {
          title: {
            contains: filter
          }
        },
        {
          description: {
            contains: filter
          }
        },
        {
          content: {
            contains: filter
          }
        },
        {
          categories: {
            some: {
              value: {
                contains: filter
              }
            }
          }
        }
      ]
    }
  })
}

export async function getSinglePostById(id: string) {
  return await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      ...DefaultAllPostSelect
    }
  })
}
