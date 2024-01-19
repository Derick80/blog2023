import type {
  CommentLike,
  Post as PrismaPost,
  User as PrismaUser,
  Like as PrismaLike,
  Favorite as PrismaFavorite,
  Category as PrismaCategory,
  Comment as PrismaComment,
  User
} from '@prisma/client'

import type { SerializeFrom } from '@remix-run/node'

export type UserSelect_v2 = Pick<
  User,
  'id' | 'username' | 'email' | 'avatarUrl' | 'role'
>

export type Post_v2 = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
  userId: string
}
export type Like_v2 = Pick<PrismaLike, 'userId' | 'postId'>

export type Favorite_v2 = Pick<PrismaFavorite, 'userId' | 'postId'>

export type Category_v2 = Pick<PrismaCategory, 'id' | 'label' | 'value'>

export type FullPost = Post_v2 & {
  user: UserSelect_v2
  likes: Like_v2[]
  favorites: Favorite_v2[]
  categories: Category_v2[]
  _count: {
    likes: number
    favorites: number
    comments: number
  }
}
