import { frontmatterType } from '../routes/writing'
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const getAllPostContent =  () => {
    const postsDirectory = path.join(process.cwd(), 'app/content/blog/');
    const fileNames = fs.readdirSync(postsDirectory);

    if (!fileNames.length) throw new Error('No posts found');

    const posts = fileNames.map(fileName => {
        const filePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        // @ts-ignore
        const { data } = matter<frontmatterType>(fileContents)
        // add slug to data object
        data.slug = fileName.replace('.mdx', '');
        // return datePublished as a string AND REMOVE  everything after and including the 'T'

        return data
    });

    // console.log(posts, 'data from getAllPostContent');

    return posts;
}
