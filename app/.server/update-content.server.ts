import { frontMatterIntermediateType, frontmatterType } from '~/routes/writing'
import { prisma } from './prisma.server'
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export const upsertContent = async (content: Omit<frontmatterType, 'code'>[]) => {
    console.log(content, 'content');

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
                    },
                    create: {
                        slug: content.slug,
                       title: content.title,
                        description: content.description,
                        author: content.author,
                        datePublished: content.datePublished,
                        published: content.published,
                        categories: content.categories,

                    }

                })
            }
        }
        )
    )
    return content
}
export const getAllPostContent =  () => {
    const postsDirectory = path.join(process.cwd(), 'app/content/blog/');
    const fileNames = fs.readdirSync(postsDirectory);

    if (!fileNames.length) throw new Error('No posts found');

    const posts = fileNames.map(fileName => {
        const filePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter<frontmatterType>(fileContents)
        // add slug to data object
        data.slug = fileName.replace('.mdx', '');
        // return datePublished as a string AND REMOVE  everything after and including the 'T'

        return data
    });

    // console.log(posts, 'data from getAllPostContent');

    return posts;
}

export const updateAllPostContent = async () => {
    const posts = await getAllPostContent();
    if (!posts) throw new Error('No posts found');
    return await upsertContent(posts);

}

// export const updateContent = async (content: Omit<frontmatterType, 'code'>[]) => {
//     const isInDatabase = await prisma.content.findMany({
//         where: {
//             slug: content.slug
//         }
//     });

//     if(isInDatabase.length )


// }