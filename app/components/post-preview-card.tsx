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
import { H3, Muted, Small } from './ui/typography'

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
    return (
        <>
            <Card>
                <CardHeader className='pb-1 pt-2'>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className='pb-2 gap-4 w-full'>
                    <CardDescription className='italic text-xs'>
                        {description}
                    </CardDescription>
                    <Muted className='text-right'>By {author}</Muted>
                </CardContent>
                <CardFooter className=''>
                    <div className='flex flex-row gap-1 md:gap-2'>
                        {categories.map((category) => (
                            <Badge key={category}>{category}</Badge>
                        ))}
                    </div>

                    <Link
                        to={`/writing/${slug}`}
                        prefetch='intent'
                        className='flex flex-end w-full'
                        onClick={() => setItem('')}
                    >
                        <Small className='text-right'>Read More</Small>
                    </Link>
                </CardFooter>
            </Card>
        </>
    )
}
