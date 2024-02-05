import { prisma } from './prisma.server'
import { PostImage } from './schemas/images.schema'
import type { CategoryForm } from './schemas/schemas'

// update and maybe use this type
export type PostInput = {
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  featured: boolean
  userId?: string
  categories: string
  postImages: PostImage[]
}

export async function createMinimalPost({
  userId,
  title
}: {
  userId: string
  title: string
}) {
  return await prisma.post.create({
    data: {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: '',
      content: '',
      imageUrl: '',
      featured: false,
      published: false,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
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
        connectOrCreate: data.categories.split(',').map((category) => {
          return {
            where: {
              value: category
            },
            create: {
              value: category,
              label: category
            }
          }
        })
      }
    }
  })
  return post
}

export async function updatePost(
  data: Omit<PostInput, 'postImages' | 'imageUrl' | 'categories'> & {
    postId: string
  }
) {
  const { title, slug, description, content, featured } = data
  return await prisma.post.update({
    where: {
      id: data.postId,
      userId: data.userId
    },
    data: {
      title,
      slug,
      description,
      content,
      featured,
      published: true
    }
  })
}

export async function changePostPublishStatus({
  id,
  userId,
  published
}: {
  id: string
  userId: string
  published: boolean
}) {
  return await prisma.post.update({
    where: {
      id,
      userId
    },
    data: {
      published
    }
  })
}

export async function changePostFeaturedStatus({
  id,
  userId,
  featured
}: {
  id: string
  userId: string
  featured: boolean
}) {
  return await prisma.post.update({
    where: {
      id,
      userId
    },
    data: {
      featured
    }
  })
}

export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    },
    select: {
      ...DefaultAllPostSelect
    },

    orderBy: {
      createdAt: 'desc'
    }
  })
  return posts
}

export const DefaultUserSelect = {
  id: true,
  username: true,
  email: true,
  avatarUrl: true,
  password: false,
  role: true
}

export const DefaultLikeSelect = {
  userId: true,
  postId: true
}

export const DefaultFavoriteSelect = {
  userId: true,
  postId: true
}

export const DefaultCommentLikeSelect = {
  userId: true,
  commentId: true
}
export const DefaultCommentSelect = {
  id: true,
  message: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: DefaultUserSelect
  },

  userId: true,
  postId: true,
  parentId: true,
  likes: {
    select: DefaultCommentLikeSelect
  }
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
  user: {
    select: DefaultUserSelect
  },
  userId: true,
  createdAt: true,
  updatedAt: true,
  comments: {
    select: DefaultCommentSelect
  },
  likes: {
    select: DefaultLikeSelect
  },
  favorites: {
    select: DefaultFavoriteSelect
  },
  categories: true,
  postImages: true,
  _count: true
}

export async function getAllUserDraftsV1(userId: string) {
  return await prisma.post.findMany({
    where: {
      published: false,
      userId
    },
    select: {
      ...DefaultAllPostSelect
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
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

// updted this to use at blog.$postId
export async function getSinglePostById(id: string) {
  return await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      ...DefaultAllPostSelect,
      comments: {
        include: {
          children: true,
          user: {
            select: DefaultUserSelect
          },
          likes: {
            select: DefaultCommentLikeSelect
          }
        }
      }
    }
  })
}

export async function getDraftOrPostToEditById({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  return await prisma.post.findUnique({
    where: {
      id,
      userId
    },
    include: {
      categories: true,
      postImages: true
    }
  })
}

export async function deletePost({
  id,
  userId
}: {
  id: string
  userId: string
}) {
  return await prisma.post.delete({
    where: {
      id,
      userId
    }
  })
}
