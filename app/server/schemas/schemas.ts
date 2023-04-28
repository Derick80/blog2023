import type { CommentLike, Post as PrismaPost } from '@prisma/client'

import type { User as PrismaUser } from '@prisma/client'

import type { Like as PrismaLike } from '@prisma/client'
import type { Favorite as PrismaFavorite } from '@prisma/client'
import type { Comment as PrismaComment } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import type { Category as PrismaCategory } from '@prisma/client'

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
