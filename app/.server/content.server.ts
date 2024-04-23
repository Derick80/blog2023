import { frontMatterIntermediateType, frontmatterType } from '~/routes/writing'
import { prisma } from './prisma.server'
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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

type PostModule = { [key: string]: unknown } // Unknown structure for now

export const getAllBlogContent = async (relativePath: string) => {


    const posts = import.meta.glob(`../content/blog/*.mdx`)
    if (!posts) throw new Error('No posts found')
    const keys = Object.keys(posts)

    const postData = await Promise.all(
        keys.map(async (key) => {
            const { frontmatter } = (await posts[key]()) as PostModule
            if (frontmatter && typeof frontmatter === 'object') {
                // Only process if frontmatter exists and is an object
                return {
                    ...frontmatter,
                    url: key,
                    slug: key
                        .replace('../content/blog/', '')
                        .replace('.mdx', ''),

                } as Omit<frontmatterType, 'code'>
            } else {
                // Handle the case where frontmatter is missing or not an object
                console.error(
                    `Error processing post: ${key}. Missing or invalid frontmatter.`
                )
                return null // Or some placeholder value if needed
            }
        })
    )

    return postData
}

export const upsertContent = async (content: Omit<frontmatterType, 'code'>[]) => {
    await Promise.all(
        content.map(async (content) => {
            if (content) {
                return await prisma.content.upsert({
                    where: {
                        slug: content.slug
                    },
                    update: {
                        title: content.title,
                        description: content.description,
                        author: content.author,
                        datePublished: content.datePublished,
                        published: content.published,
                        categories: content.categories,
                        updatedAt: new Date()
                    },
                    create: {
                        slug: content.slug,
                       title: content.title,
                        description: content.description,
                        author: content.author,
                        datePublished: content.datePublished,
                        published: content.published,
                        categories: content.categories,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }

                })
            }
        }
        )
    )
    return content
}

export const updateAllContent = async () => {
    const posts = await getAllBlogContent('blog')
    if (!posts) throw new Error('No posts found')
    return await upsertContent(posts)
}





export const getPostContent = async (slug: string) => {
    const filePath = path.join(__dirname, '../content/blog', `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return data;
}


export const updateDataBaseContent = async ({ content }: {
    content: Omit<frontmatterType, 'code'>[]
}) => {
    try {
        for (const post of content) {
            const { title, author, description, datePublished, published, slug, categories } = post
            await prisma.content.upsert({
                where: {
                    slug
                },
                update: {
                    title,
                    author,
                    description,
                    datePublished,
                    published,
                    categories
                },
                create: {
                    title,
                    author,
                    description,
                    datePublished,
                    published,
                    slug,
                    categories
                }
            })
        }
    } catch (err) {
        console.error(err);
    }
    finally {
        console.log('done');
    }





}

