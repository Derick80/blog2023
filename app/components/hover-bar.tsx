/*

'post-floating-bar fixed left-0 right-0 z-50 flex h-12 w-full flex-wrap justify-center 2xl:h-14 active animation'

 */

import { HeartIcon, Share1Icon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useOptionalUser } from '~/lib/functions'
import { useFetcher } from '@remix-run/react'
import React from 'react'

/* 'class="relative mx-auto flex h-12 shrink flex-wrap items-center justify-center rounded-full border-1/2 border-slate-200 bg-white px-5 py-1 text-sm  text-slate-800 shadow-xl dark:border-slate-500 dark:bg-slate-700 dark:text-slate-50 2xl:h-14"' */

export type HoverBarProps = {
    contentDetails: {
        _count: {
            loves: number
        },
        loves: {
            userId: string,
            contentId: string
        }[]

    }
}
const HoverBar = ({ contentDetails }: HoverBarProps) => {
    const user = useOptionalUser()
    // extract contentId from the contentDetails object
    const contentId = contentDetails.loves.map((love) => love.contentId)[0]

    console.log(contentId, 'contentId');

    const [likeCount, setLikeCount] = React.useState(contentDetails._count.loves)
    const hasLiked = contentDetails.loves.some((love) => love.userId === user?.id)

    const [userLiked, setUserLiked] = React.useState(hasLiked)

    const likeFetcher= useFetcher()
    const handleLike = async () => {
        if (!user) return alert('You must be logged in to like this post')

        if (userLiked) {
            setLikeCount((prev) => prev - 1)
            setUserLiked(false)
        } else {
            setLikeCount((prev) => prev + 1)
            setUserLiked(true)
        }
        likeFetcher.submit({
                userId: user?.id,
                contentId: contentId,
                intent: 'like',

            },
            {
                method: 'post',
                action:`/writing/${contentId}`
            }
        )

    }

    return (
        <div className='post-floating-bar active animation fixed left-0 right-0 z-50 flex h-12 w-full flex-wrap justify-center 2xl:h-14 bottom-10'>
            <div className='border-1/2 relative mx-auto flex h-12 shrink flex-wrap items-center justify-center rounded-full border-primary bg-primary px-5 py-1 text-sm  text-primary-foreground shadow-xl 2xl:h-14'>
                <Button
                    type='button'
                    variant='default'
                    size='sm'
                    disabled={ !user }

                    className={userLiked ? 'bg-red-500 text-white' :`bg-white text-black`  }
                                onClick={() => alert(`Liked ${contentDetails.loves.map((love) => love.contentId)}`) }
                >
                    <span className='ml-2 text-xs font-bold'>
                        <HeartIcon />
                        <Badge
                            variant='secondary'
                        >
                            {likeCount}
                            </Badge>
                    </span>{' '}
                </Button>
                <span className='ml-2 text-xs font-bold'>
                    <Share1Icon /> Share
                </span>
            </div>
        </div>
    )
}

export default HoverBar
