import { json, type MetaFunction } from '@remix-run/node'
import ContactWidget from '../components/contact-widget'
import { getAllContentFromDB } from '~/.server/content.server'
import { Link, NavLink, useLoaderData, useMatches } from '@remix-run/react'
import { H1, H2 } from '~/components/ui/typography'

export const meta: MetaFunction = () => {
    return [
        { title: `Derick's Personal Web App` },
        { name: 'description', content: 'Welcome  to DerickCHoskinson.com' }
    ]
}

export async function loader() {
    const posts = await getAllContentFromDB()
    if (!posts) throw new Error('No posts found')

    const categories = posts.map((post) => post.categories).flat()
    const uniqueCategories = [...new Set(categories)]
    console.log(uniqueCategories,'uniqueCategories');


    return json({uniqueCategories  })
}

export default function Index () {
    const { uniqueCategories } = useLoaderData<typeof loader>()
    return (
        <div className='flex flex-col gap-4 items-center justify-center w-full h-full'>
            <H1>Welcome to DerickCHoskinson.com</H1>
            <H2>Blog Categories</H2>
            {CategoryNavigation(uniqueCategories)}
            <ContactWidget />
            <H2>Browse By Category</H2>
    </div>
    )
}


const CategoryNavigation = (uniqueCategories: string[]) => {
    return (
        <nav className='flex flex-col gap-2'>
            {uniqueCategories.map((category) => (
                <NavLink key={category} to={`/writing/${category}`}>
                    {category}
                </NavLink>
            ))}
        </nav>
    )
}