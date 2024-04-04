import type { MetaFunction } from '@remix-run/node'
import { ThemeToggle } from '~/components/theme/theme-toggle'

export const meta: MetaFunction = () => {
    return [
        { title: 'New Remix App' },
        { name: 'description', content: 'Welcome to Remix!' }
    ]
}

export default function Index() {
    return (
        <h1 className='text-3xl font-bold underline'>
            Hello world!
            <ThemeToggle />
        </h1>
    )
}
