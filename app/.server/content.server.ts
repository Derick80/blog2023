import { frontmatterType } from '../routes/writing'
import { prisma } from './prisma.server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
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
                        id:userId
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

type PostModule = { [key: string]: unknown } // Unknown structure for now

export const getPostContent = async (slug: string) => {
    const filePath = path.join(__dirname, '../content/blog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    return data
}

// updateDataBaseContent is my most recent function for updating the database with new content

export const updateDataBaseContent = async ({
    content
}: {
    content: Omit<frontmatterType, 'code'>[]
}) => {
    // map content to only slug and categories
    const slugAndCategories = content.map(({ slug, categories }) => {
        return {
            slug,
            title: slug,
            categoryId: categories.map((category) => {
                return {
                    title: category
                }
            })
        }
    })

    console.log(slugAndCategories, 'slugAndCategories')

    try {
    } catch (err) {
        console.error(err)
    } finally {
        console.log('done')
    }
}

// async functions for retreiving data after first dev.

export const getDbContent = async () => {
    return await prisma.content.findMany({
        where: {
            published: true
        },
        include: {
            categories: {
                select: {
                    id: true,
                    title: true,
                    contentId: true
                }
            },
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
        },
        orderBy: {
            datePublished: 'desc'
        }
    })
}
