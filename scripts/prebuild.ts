import { prisma } from '~/.server/prisma.server'
import { getAllPostContent } from '~/.server/update-content.server'

async function getThings() {
    const content = getAllPostContent()
    if (!content) throw new Error('No content found')
    console.log(content, 'content')

    for (const cont of content) {
        const updated = await prisma.content.upsert({
            where: {
                slug: cont.slug
            },
            update: {
                title: cont.title,
                author: cont.author,
                description: cont.description,
                datePublished: cont.datePublished,
                published: cont.published,
                categories: cont.categories
            },
            create: {
                title: cont.title,
                author: cont.author,
                description: cont.description,
                datePublished: cont.datePublished,
                published: cont.published,
                slug: cont.slug,
                categories: cont.categories
            }
        })
        console.log(updated, 'updated')
    }
}

getThings()

// const updated = await getandUpdate('/app/content/blog/*.mdx')
