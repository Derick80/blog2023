import { prisma } from './prisma.server'

export async function createComment({
  postId,
  userId,
  message,
  parentId
}: {
  postId: string
  userId: string
  message: string
  parentId?: string
}) {
  return await prisma.comment.create({
    data: {
      message,
      user: {
        connect: {
          id: userId
        }
      },
      ...(parentId && {
        parent: {
          connect: {
            id: parentId
          }
        }
      }),
      post: {
        connect: {
          id: postId
        }
      }
    }
  })
}
