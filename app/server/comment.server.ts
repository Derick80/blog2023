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

export async function replyToComment({
  postId,
  userId,
  message,
  parentId
}: {
  postId: string
  userId: string
  message: string
  parentId: string
}) {
  return await prisma.comment.create({
    data: {
      message: message,
      user: {
        connect: {
          id: userId
        }
      },
      parent: {
        connect: {
          id: parentId
        }
      },
      post: {
        connect: {
          id: postId
        }
      }
    }
  })
}

export async function editCommentMessage({
  commentId,
  message,
  userId
}: {
  commentId: string
  message: string
  userId: string
}) {
  const updated = await prisma.comment.update({
    where: {
      id: commentId
    },
    data: {
      message,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
  return updated
}
