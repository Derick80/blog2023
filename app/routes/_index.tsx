import type { MetaFunction } from '@remix-run/node'
import ContactWidget from '~/components/contat-widget'

export const meta: MetaFunction = () => {
    return [
        { title: `Derick's Personal Web App` },
        { name: 'description', content: 'Welcome  to DerickCHoskinson.com' }
    ]
}

export default function Index() {
    return (
        <>
            <ContactWidget />
        </>
    )
}
