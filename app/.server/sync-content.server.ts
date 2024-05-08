import { prisma } from './prisma.server'


// I am using this to update the database with the content from the blog folder. I will use this in a github action to update the database with the content from the blog folder once I figure itout
export const updateDBContent = async (
    posts: {
        slug: string
        title: string
        author: string
        description: string
        datePublished: string
        published: boolean
        categories: string[]
    }[]
) => {
    for (let i = 0; i < posts.length; i++) {
        try {
            await prisma.content.upsert({
                where: {
                    slug: posts[i].slug
                },
                update: {
                    title: posts[i].title,
                    author: posts[i].author,
                    description: posts[i].description,
                    datePublished: posts[i].datePublished,
                    published: posts[i].published,
                    categories: {
                        connectOrCreate: posts[i].categories.map((category) => {
                            return {
                                where: {
                                    title: category
                                },
                                create: {
                                    title: category
                                }
                            }
                        })
                    }
                },
                create: {
                    slug: posts[i].slug,
                    title: posts[i].title,
                    author: posts[i].author,
                    description: posts[i].description,
                    datePublished: posts[i].datePublished,
                    published: posts[i].published,
                    categories: {
                        connectOrCreate: posts[i].categories.map((category) => {
                            return {
                                where: {
                                    title: category
                                },
                                create: {
                                    title: category
                                }
                            }
                        })
                    }
                }
            })
            console.log(`Post ${posts[i].slug} updated`)
        } catch (error) {
            console.error(`Error updating post ${posts[i].slug}`, error)
        }
    }
}

export const seedInitialDbwithContent = async (
    posts: {
        slug: string
        title: string
        author: string
        description: string
        datePublished: string
        published: boolean
        categories: string[]
    }[]
) => {
    await prisma.contentCategory.deleteMany()
    for (let i = 0; i < posts.length; i++) {
        await prisma.content.create({
            data: {
                title: posts[i].title,
                author: posts[i].author,
                description: posts[i].description,
                datePublished: posts[i].datePublished,
                published: posts[i].published,
                slug: posts[i].slug
            }
        })
    }
    const allPostsSlugs = await prisma.content.findMany({
        select: {
            slug: true
        }
    })

    await prisma.contentCategory.deleteMany()
    // flatten the categories array so it has a unique title and connect it to the post.slug for each category

    const categories = posts.map((post) => post.categories).flat()
    const uniqueCategories = [...new Set(categories)]
    console.log(uniqueCategories, 'uniqueCategories')

    // Using the post data create a new array of objects that will by category and connect to the post.slug

    const getSlugsWithCategories = (category: string) => {
        return allPostsSlugs.map((post) => {
            return {
                title: category,
                contentId: post.slug
            }
        })
    }

    // Create the categories in the database with the post.slug connected to it
    for (let i = 0; i < uniqueCategories.length; i++) {
        await prisma.contentCategory.createMany({
            data: getSlugsWithCategories(uniqueCategories[i]),
            skipDuplicates: true
        })
    }

    const allCategories = await prisma.contentCategory.findMany({
        select: {
            title: true,
            contentId: true
        }
    })

    const updatedWithCats = await prisma.content.findMany({
        select: {
            title: true,

            categories: {
                select: {
                    title: true
                }
            }
        }
    })
}

// Path: app/.server/prisma.server.ts
