import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import ContactWidget from '..//components/contat-widget'
import { getAllPostContent, seedInitialDbwithContent } from '~/.server/update-content.server'
import { prisma } from '~/.server/prisma.server'

export const meta: MetaFunction = () => {
    return [
        { title: `Derick's Personal Web App` },
        { name: 'description', content: 'Welcome  to DerickCHoskinson.com' }
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    // const posts = await getDbContent()
    const posts = getAllPostContent()
    if (!posts) throw new Error('No posts found')

    console.log(posts, 'posts');
     const categories = posts.map((post) => post.categories).flat()
    const uniqueCategories = [...new Set(categories)]
    console.log(uniqueCategories, 'uniqueCategories');

    const allPostsSlugs = await prisma.content.findMany({
        select: {
            slug: true
        }
    })




    return json({ posts })
}


export default function Index() {
    return (
        <div className='flex flex-col gap-4 items-center justify-center w-full h-full'>
            <ContactWidget />
        </div>
    )
}

export type frontToDB = {
    title: string
    description: string
    datePublished: string
    published: boolean
    categories: {
        connectOrCreate: {
            where: { title: string }
            create: { title: string }
        }[]
    }

    slug: string
}
