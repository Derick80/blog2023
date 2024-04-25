import { getAllPostContent,updateDBContent } from '~/.server/update-content.server'

async function updateDataBaseContent(){
    const posts = getAllPostContent()
    if (!posts) throw new Error('No posts found')
    console.log(posts, 'posts')

    await updateDBContent(posts)
}
