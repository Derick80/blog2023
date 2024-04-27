import { getAllPostContent, seedInitialDbwithContent } from  '../app/.server/update-content.server'


async function getThings() {
    const posts = getAllPostContent()
    if (!posts) throw new Error('No posts found')
    console.log(posts, 'posts')

    await seedInitialDbwithContent(posts)
}

await getThings()
// const updated = await getandUpdate('/app/posts/blog/*.mdx')
