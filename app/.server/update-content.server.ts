import { frontmatterType } from '../routes/writing'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { prisma } from './prisma.server'

// I am using this in my prebuild script to get all the content from the blog folder and update the database
// I want to create a github action that will run this script and update the database with the content from the blog folder

export const getAllPostContent = () => {
    const postsDirectory = path.join(process.cwd(), 'app/content/blog/')
    const fileNames = fs.readdirSync(postsDirectory)

    if (!fileNames.length) throw new Error('No posts found')

    const posts = fileNames.map((fileName) => {
        const filePath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        // @ts-ignore
        const { data } = matter<frontmatterType>(fileContents)
        // add slug to data object
        data.slug = fileName.replace('.mdx', '')
        // return datePublished as a string AND REMOVE  everything after and including the 'T'

        return data
    })

    // console.log(posts, 'data from getAllPostContent');

    return posts
}



export const sendPoststoDb = async (posts: {
  slug: string;
  title: string;
  author: string;
  description: string;
  datePublished: string;
  published: boolean;
  categories: string[];
}[]) => {
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
    console.log('Posts have been sent to the database')
}
