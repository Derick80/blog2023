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
            <Card className='w-full'>
                <CardHeader className='pb-1 pt-2'>
                    <CardTitle>
                        <Link
                            to={`/writing/${slug}`}
                            prefetch='intent'
                            onClick={() => setItem('')}
                        >
                            <H3>{title}</H3>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent className='pb-2 gap-4 w-full'>
                    <CardDescription className='italic text-xs'>
                        {description}
                    </CardDescription>
                </CardContent>
                <CardFooter className='flex flex-col items-start gap-1 md:gap-2 pb-1 md:pb-2'>
                    <div className='flex flex-row flex-wrap gap-1 md:gap-2'>
                        {categories.map((category) => (
                            <Badge key={category}>{category}</Badge>
                        ))}
                    </div>

                    <Muted>By {author}</Muted>
                </CardFooter>
            </Card>
        </>
    )
}
