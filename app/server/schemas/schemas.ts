import type {
  CommentLike,
  Post as PrismaPost,
  User as PrismaUser,
  Like as PrismaLike,
  Favorite as PrismaFavorite,
  Category as PrismaCategory,
  Comment as PrismaComment,
  PostImage as PrismaPostImage
} from '@prisma/client'

import type { SerializeFrom } from '@remix-run/node'

export type UserSelect_v2 = Pick<
  User,
  'id' | 'username' | 'email' | 'avatarUrl' | 'role'
>

export type CategoryMinimal = Pick<PrismaCategory, 'id' | 'label' | 'value'>

// typings for postImages
export type PostImage = SerializeFrom<PrismaPostImage>
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
  children: Omit<Comment, 'createdBy'>[]
  likes: SerializeFrom<CommentLike>[]
}

export type CommentWithChildren = Comment & {
  user: User
  children: CommentWithChildren[]
  likes: SerializeFrom<CommentLike>[]
}

export type Category = SerializeFrom<PrismaCategory>
export type Post = SerializeFrom<PrismaPost> & {
  user: User
  postImages: PostImage[]
  likes: Like[]
  favorites: Favorite[]
  categories: Category[]
  comments: CommentWithChildren[]
  _count: {
    likes: number
    favorites: number
    comments: number
  }
}

export type AllPostsDisplayType = SerializeFrom<PrismaPost>

export type DraftType = SerializeFrom<PrismaPost> & {
  postImages: PostImage[]
  categories: Category[]
}
export type CategoryForm = {
  value: string
}[]
