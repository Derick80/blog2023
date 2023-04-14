import type {Post as PrismaPost} from '@prisma/client'

import type {User as PrismaUser} from '@prisma/client'

import type {Like as PrismaLike} from '@prisma/client'

import type {Comment as PrismaComment} from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import type {Category as PrismaCategory} from '@prisma/client'
export type User = SerializeFrom<Omit<PrismaUser, 'password'>>

export type Like = SerializeFrom<PrismaLike>
export type Comment = SerializeFrom<PrismaComment> & {
    children: Comment[]
}

export type Category= SerializeFrom<PrismaCategory>
export type Post = SerializeFrom<PrismaPost> & {
    user: User,
    likes: Like[],
    categories: Category[],

}