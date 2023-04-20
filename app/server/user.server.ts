import { prisma } from './auth/prisma.server'

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      _count: {
        select: {
          posts: true,
          favorites: true,
          comments: true,
          likes: true
        }
      }
    }
  })
  return users
}
