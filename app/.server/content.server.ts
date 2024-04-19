import { prisma } from './prisma.server'


export const getPostInformation = async (slug: string) => {
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

export const likeContent = async (userId: string, contentId: string) => {
    const hasLiked = await prisma.love.findUnique({
        where: {
            contentId_userId: {
                userId,
                contentId
            }
        }
    })
    if (hasLiked) {
        return await prisma.love.delete({
            where: {
                contentId_userId: {
                    userId,
                    contentId
                }
            }
        })
    } else {
        return await prisma.love.create({
            data: {
                userId,
                contentId
            }
        })
    }
}

