import { prisma } from './prisma.server'


export const getContentInfoFromDB = async (slug: string) => {
    return await prisma.content.findUnique({
        where: {
            slug
        },
        select: {
            slug: true,
            loves: {
                select: {
                    userId: true,
                    contentId: true
                }
            },
            _count: {
                select: {
                    loves: true
                }
            }
        }
    })
}

export const likeContent = async ({
    userId,
    contentId
}: {
    userId: string
    contentId: string
}) => {
    const hasLiked = await prisma.love.findUnique({
        where: {
            contentId_userId: {
                userId,
                contentId
            }
        }
    })
    console.log(hasLiked, 'hasLiked')

    if (hasLiked !== null) {
        const liked = await prisma.love.delete({
            where: {
                contentId_userId: {
                    userId,
                    contentId
                }
            }
        })
        return liked
    } else {
        const liked = await prisma.love.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                content: {
                    connect: {
                        slug: contentId
                    }
                }
            }
        })
        return liked
    }
}

