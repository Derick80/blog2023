/*

'post-floating-bar fixed left-0 right-0 z-50 flex h-12 w-full flex-wrap justify-center 2xl:h-14 active animation'

 */

import { HeartFilledIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useOptionalUser } from '~/lib/functions'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import { Muted } from './ui/typography'

/* 'class="relative mx-auto flex h-12 shrink flex-wrap items-center justify-center rounded-full border-1/2 border-slate-200 bg-white px-5 py-1 text-sm  text-slate-800 shadow-xl dark:border-slate-500 dark:bg-slate-700 dark:text-slate-50 2xl:h-14"' */

export type HoverBarProps = {
    contentDetails: {
        _count: {
            loves: number
        }
        loves: {
            userId: string
            contentId: string
        }[]
    }
}
const HoverBar = ({ contentDetails }: HoverBarProps) => {
    const [likeCount, setLikeCount] = React.useState(
        contentDetails._count.loves
    )
    // determine if the user is logged in or not. If there is no user the like button will be disabled
    // if there is a user, the like button will be enabled and the currentUserId will be set to the user's userId and used to determine if the user has liked the post or not
    const user = useOptionalUser()
    const currentUser = user?.userId
    const hasLiked = contentDetails.loves.some(
        (love) => love.userId === currentUser
    )

    const [userLiked, setUserLiked] = React.useState(hasLiked)
    // extract contentId from the contentDetails object
    const contentId = contentDetails.loves.map((love) => love.contentId)[0]

    const likeFetcher = useFetcher()
    const handleLike = async () => {
        if (!user) return alert('You must be logged in to like this post')

        if (userLiked) {
            setLikeCount((prev) => prev - 1)
            setUserLiked(false)
        } else {
            setLikeCount((prev) => prev + 1)
            setUserLiked(true)
        }
        likeFetcher.submit(
            {
                contentId: contentId,
                intent: 'like-content'
            },
            {
                method: 'POST',
                action: `/writing/${contentId}`
            }
        )
    }

    return (
        <div className='not-prose fixed left-0 right-0 z-50 flex h-12 w-full justify-center 2xl:h-14 bottom-10'>
            <div className='border-2 relative mx-auto flex h-12 w-fit  items-center justify-between rounded-full border-primary bg-slate-100 dark:bg-slate-600 px-5 py-1 text-sm  text-primary-foreground shadow-xl 2xl:h-14'>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    name='intent'
                    value='like-content'
                    disabled={!user}
                    onClick={handleLike}
                    className='relative z-20 mr-4 rounded-full p-1'
                >
                    {userLiked ? (
                        <HeartFilledIcon className='text-red-500' />
                    ) : (
                        <HeartIcon />
                    )}
                    <span className='absolute bottom-0 right-0 translate-x-2 translate-y-1 rounded-full bg-transparent px-2 py-1 text-xs text-primary'>
                        {likeCount}
                    </span>
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='relative z-20'
                >
                    <Share1Icon className='text-primary' />
                </Button>
            </div>
        </div>
    )
}

export default HoverBar
