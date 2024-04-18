import { Link, Outlet, useLocation } from '@remix-run/react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from './ui/card'
import { Badge } from './ui/badge'
import { H3 } from './ui/typography'

type PostPreviewCardProps = {
    title: string
    author: string
    description: string
    datePublished: string
    published: boolean
    categories: string[]
    slug: string
    setItem: (item: string) => void
}

export default function PostPreviewCard({
    title,
    author,
    description,
    datePublished,
    published,
    categories,
    slug,
    setItem
}: PostPreviewCardProps) {
    const location = useLocation()
    const handleClick = () => {
        if (location.pathname !== '/blog') {
            setItem('item-1')
        }
    }

    return (
        <>
            <Card className='ml-2'>
                <CardHeader className='pb-1 pt-2'>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className='pb-2 gap-4 w-full'>
                    <CardDescription className='italic text-xs'>
                        {description}
                    </CardDescription>
                    <H3>Categories</H3>
                    {categories.map((category) => (
                        <Badge className='mr-2' key={category}>
                            {category}
                        </Badge>
                    ))}
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-gray-500'>By {author}</p>
                    <p className='text-sm text-gray-500'>{datePublished}</p>

                    <p className='text-sm text-gray-500'>
                        {published ? 'Published' : 'Draft'}
                    </p>
                    <Link
                        to={`/blog/${slug}`}
                        onClick={() => setItem('')}
                        className='text-blue-500'
                    >
                        Read more
                    </Link>
                </CardFooter>
            </Card>
        </>
    )
}
