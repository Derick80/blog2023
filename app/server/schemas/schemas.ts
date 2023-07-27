import type {
  CommentLike,
  Post as PrismaPost,
  User as PrismaUser,
  Like as PrismaLike,
  Favorite as PrismaFavorite,
  Category as PrismaCategory,
  Comment as PrismaComment
} from '@prisma/client'

import type { SerializeFrom } from '@remix-run/node'

export type User = Omit<PrismaUser, 'password' | 'createdAt' | 'updatedAt'>

export type UserType = User & {
  _count: {
    favorites: number
    accounts: number
    tokens: number
    posts: number
    comments: number
    likes: number
    projects: number
    books: number
    messages: number
  }
}

export type Like = SerializeFrom<PrismaLike>
export type Favorite = SerializeFrom<PrismaFavorite>

export type Comment = SerializeFrom<PrismaComment> & {
  user: User
  likes: SerializeFrom<CommentLike>[]
}

export type CommentWithChildren = SerializeFrom<PrismaComment> & {
  user: User
  children: CommentWithChildren[]
  likes: SerializeFrom<CommentLike>[]
}

export type Category = SerializeFrom<PrismaCategory>
export type Post = SerializeFrom<PrismaPost> & {
  user: User
  likes: Like[]
  favorites: Like[]
  categories: Category[]
  comments: CommentWithChildren[]
  _count?: {
    likes: number
    favorites: number
    comments: number
    commentsLikes: number
  }
}

export type CategoryForm = {
  value: string
}[]
