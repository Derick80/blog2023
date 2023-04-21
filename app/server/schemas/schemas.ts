import type { Post as PrismaPost } from '@prisma/client'

import type { User as PrismaUser } from '@prisma/client'

import type { Like as PrismaLike } from '@prisma/client'
import type { Favorite as PrismaFavorite } from '@prisma/client'
import type { Comment as PrismaComment } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import type { Category as PrismaCategory } from '@prisma/client'

export type User = SerializeFrom<Omit<PrismaUser, 'password'>>

export type Like = SerializeFrom<PrismaLike>
export type Favorite = SerializeFrom<PrismaFavorite>

export type Comment = SerializeFrom<PrismaComment>

export type CommentWithChildren = SerializeFrom<PrismaComment> & {
  user: User
  children: CommentWithChildren[]
}

export type Category = SerializeFrom<PrismaCategory>
export type Post = SerializeFrom<PrismaPost> & {
  user: User
  likes: Like[]
  favorites: Like[]
  categories: Category[]
  comments: CommentWithChildren[]
}

export type CategoryForm = {
  value: string
}[]
