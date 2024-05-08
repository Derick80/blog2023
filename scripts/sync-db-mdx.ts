import { getAllPostContent } from '~/.server/mdx-compile.server'
import {
    updateDBContent
} from '~/.server/sync-content.server'

async function updateDataBaseContent() {
    const posts = getAllPostContent()
    if (!posts) throw new Error('No posts found')
    console.log(posts, 'posts')

    await updateDBContent(posts)
}
