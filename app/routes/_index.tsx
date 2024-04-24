import {
    type MetaFunction
} from '@remix-run/node'
import ContactWidget from '..//components/contat-widget'

export const meta: MetaFunction = () => {
    return [
        { title: `Derick's Personal Web App` },
        { name: 'description', content: 'Welcome  to DerickCHoskinson.com' }
    ]
}

export default function Index() {
    return (
        <div
            className='flex flex-col gap-4 items-center justify-center w-full h-full'
        >
            <ContactWidget />
        </div>
    )
}
