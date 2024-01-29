import type { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'
import { createPasswordHash } from './auth/auth-service.server'
import type { UserImage as userImg } from '@prisma/client'
export type UserProps = {
  id: string
  email: string
  username: string
  avatarUrl: string | null
  role: string | null
  userImages: userImg[]
  _count: {
    accounts: number
    tokens: number
    posts: number
    likes: number
    projects: number
  }
}

const defaultUserSelect = {
  id: true,
  email: true,
  username: true,
  avatarUrl: true,
  role: true,
  userImages: true,
  _count: true
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      role: true,
      userImages: true,
      _count: {
        select: {
          posts: true,
          favorites: true,
          comments: true,
          likes: true,
          projects: true,
          userImages: true
        }
      }
    }
  })
  return users
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username
    },
    select: defaultUserSelect
  })
}

export const createUser = async (
  input: Prisma.UserCreateInput & {
    password?: string
    account?: Omit<Prisma.AccountCreateInput, 'user'>
  }
) => {
  const data: Prisma.UserCreateInput = {
    email: input.email
  }

  if (input.password) {
    data.password = await createPasswordHash(input.password)
  }

  if (input.account) {
    data.accounts = {
      create: [
        {
          provider: input.account.provider,
          providerAccountId: input.account.providerAccountId,
          accessToken: input.account.accessToken,
          refreshToken: input.account.refreshToken
        }
      ]
    }
  }

  const user = await prisma.user.create({
    data,
    select: defaultUserSelect
  })

  return user
}

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: defaultUserSelect
  })
  return user
}

export const getUser = async (input: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: input,
    select: defaultUserSelect
  })
  return user
}

export const getUserPasswordHash = async (
  input: Prisma.UserWhereUniqueInput
) => {
  const user = await prisma.user.findUnique({
    where: input
  })
  if (user) {
    return {
      user: { ...user, password: null },
      passwordHash: user.password
    }
  }
  return { user: null, passwordHash: null }
}

export async function getUserProfile({ userId }: { userId: string }) {
  return await prisma.profile.findUnique({
    where: {
      id: userId
    },
    include: {
      socials: true
    }
  })
}
