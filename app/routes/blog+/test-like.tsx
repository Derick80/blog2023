import { BoxIcon, ChevronDownIcon, HeartIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Button } from '~/components/ui/button'

const LikeContainer = () => {
    const [liked, setLiked] = React.useState(false)
    return (
        <div
            className=' border-red-500 w-full h-full'>
            hi there
            <ChevronDownIcon />
            <Button
                onClick={ () => setLiked(!liked) }
                variant='default'
            >
                { liked ? <HeartIcon /> : <BoxIcon /> }
            </Button>

        </div>

    )

}


export default LikeContainer