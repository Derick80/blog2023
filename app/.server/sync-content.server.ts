import { PostFrontMatter } from './mdx-compile.server'
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
                        update:
                            posts[i].categories
                    }
                    },


            })
            console.log(`Post ${posts[i].slug} updated`)
        } catch (error) {
            console.error(`Error updating post ${posts[i].slug}`, error)
        }
    }
}

export const seedInitialDbwithContent = async (
    posts: PostFrontMatter[]
) => {

    for (let i = 0; i < posts.length; i++) {
        try {
            await prisma.content.create({
                data: {
                    slug: posts[i].slug,
                    title: posts[i].title,
                    author: posts[i].author,
                    description: posts[i].description,
                    datePublished: posts[i].datePublished,
                    published: posts[i].published,
                    categories: {
                        set:
                            posts[i].categories
                    }

                }
            })
            console.log(`Post ${posts[i].slug} created`)

        }
        catch (error) {
            console.error(`Error updating post ${posts[i].slug}`, error)
        }



    }
}

// Path: app/.server/prisma.server.ts
