import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { updateDataBaseContent } from '~/.server/content.server'
import { getAllPostContent } from '~/.server/update-content.server'
import ContactWidget from '~/components/contat-widget'

export const meta: MetaFunction = () => {
    return [
        { title: `Derick's Personal Web App` },
        { name: 'description', content: 'Welcome  to DerickCHoskinson.com' }
    ]
}

export async function loader ({ request }: LoaderFunctionArgs) {
    const posts = await getAllPostContent()
    // console.log(posts, 'posts from loader');

    if (!posts) throw new Error('No posts found')
await updateDataBaseContent({ content: posts })
    return json({posts})
}

export default function Index() {
    return (
        <>
            <ContactWidget />
        </>
    )
}
