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

export type Like_v2 = Pick<PrismaLike, 'userId' | 'postId'>

export type Favorite_v2 = Pick<PrismaFavorite, 'userId' | 'postId'>

export type Category_v2 = Pick<PrismaCategory, 'id' | 'label' | 'value'>

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
  children: Comment[]
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
  favorites: Like[]
  categories: Category[]
  comments: CommentWithChildren[]
  _count: {
    likes: number
    favorites: number
    comments: number
    commentsLikes: number
  }
}

export type CategoryForm = {
  value: string
}[]
