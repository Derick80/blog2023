import { prisma } from './prisma.server'
import { PostImage } from './schemas/images.schema'

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

const createMinimalPost = async ({
  userId,
  title
}: {
  userId: string
  title: string
}) => {
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

const createPost = async (data: PostInput) => {
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

const updatePost = async (
  data: Omit<PostInput, 'postImages' | 'imageUrl' | 'categories'> & {
    postId: string
  }
) => {
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

const changePostPublishStatus = async ({
  id,
  userId,
  published
}: {
  id: string
  userId: string
  published: boolean
}) => {
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

const changePostFeaturedStatus = async ({
  id,
  userId,
  featured
}: {
  id: string
  userId: string
  featured: boolean
}) => {
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

const getPosts = async () => {
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

const getAllUserDraftsV1 = async (userId: string) => {
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
const getAllPostsV1WithFilter = async (filter: string) => {
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
const getSinglePostById = async (id: string) => {
  return await prisma.post.findUnique({
    where: {
      id
    },

    include: {
      user: {
        select: DefaultUserSelect
      },
      likes: {
        select: DefaultLikeSelect
      },
      favorites: {
        select: DefaultFavoriteSelect
      },
      _count: true,
      postImages: true,
      categories: true
    }
  })
}

const getDraftOrPostToEditById = async ({
  id,
  userId
}: {
  id: string
  userId: string
}) => {
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

const deletePost = async ({ id, userId }: { id: string; userId: string }) => {
  return await prisma.post.delete({
    where: {
      id,
      userId
    }
  })
}

const updateTitle = async ({ id, title }: { id: string; title: string }) => {
  return await prisma.post.update({
    where: {
      id
    },
    data: {
      title
    }
  })
}

const updateDescription = async ({
  id,
  description
}: {
  id: string
  description: string
}) => {
  return await prisma.post.update({
    where: {
      id
    },
    data: {
      description
    }
  })
}

const updateContent = async ({
  id,
  content
}: {
  id: string
  content: string
}) => {
  return await prisma.post.update({
    where: {
      id
    },
    data: {
      content
    }
  })
}

export {
  createMinimalPost,
  createPost,
  updatePost,
  changePostPublishStatus,
  changePostFeaturedStatus,
  getPosts,
  getAllUserDraftsV1,
  getAllPostsV1WithFilter,
  getSinglePostById,
  getDraftOrPostToEditById,
  deletePost,
  updateTitle,
  updateDescription,
  updateContent
}
