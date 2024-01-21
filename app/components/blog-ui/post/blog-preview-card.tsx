import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import FavoriteContainer from '~/components/favorite-container'
import { PresetShare } from '~/components/share-button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '~/components/ui/card'
import { Small } from '~/components/ui/typography'
import { Post } from '~/server/schemas/schemas'
import LikeContainer from '../like-container'
import { Link } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'

const BlogPreviewCard = ({ post }: { post: Omit<Post, 'comments'> }) => {
    const user = useOptionalUser()
    const isAdmin = user?.role !== 'ADMIN'

    const { title, description, content, published, id, userId } = post
    const { likes, favorites } = post

    const isOwner = user?.id === userId

    const canEdit = isAdmin ? true : isOwner ? true : false


    return (
        <Card
            className=''
        >
            <CardHeader>
                <CardTitle>
                    { title }
                </CardTitle>
                <CardDescription>{ description }</CardDescription>
            </CardHeader>

            <CardFooter
                className='pb-2 justify-between'
            >
                <div className='flex flex-row items-center gap-2'>
                    <LikeContainer postId={ id } likes={ likes } />
                    <FavoriteContainer postId={ id } favorites={ favorites } />
                    <PresetShare id={ id } />
                </div>
                <div
                    className='flex flex-row items-center gap-2'>


                </div>



                <div className='flex flex-row items-end gap-2'>
                    <ReadMore postId={ id } />
                </div>

            </CardFooter>
        </Card>
    )
}

function ReadMore ({ postId }: { postId: string }) {

    return (
        <Link
            className='flex items-center gap-2'
            to={ `/blog/${postId}` } prefetch='intent'>
            <Small

            >Read More</Small>
            <DoubleArrowRightIcon className='w-4 h-4 stroke-current' />
        </Link>
    )
}

export default BlogPreviewCard