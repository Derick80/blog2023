// scripts/preibuild.
import { getAllPostContent } from '../app/.server/update-content.server';
import { updateDataBaseContent } from '../app//.server/content.server';

export async function prebuild() {
    try {
          const posts = await getAllPostContent()
    // console.log(posts, 'posts from loader');

    if (!posts) throw new Error('No posts found')
await updateDataBaseContent({ content: posts })
    }
    catch (error) {
        console.error(error)
    }
}