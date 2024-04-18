import { useFetcher, useMatches } from '@remix-run/react'
import React from 'react'
import { getUser, getUsers } from '~/.server/user.server'
import { useOptionalUser } from '~/lib/functions'

export type LikeContainerProps = {
    slug: string,
}
export const LikeContainer = ({ slug }: {
    slug: string
}) => {


    const user = useOptionalUser()
    if(!user) return null
    const userId = user.id

    const matches = useMatches()

    return (
        <div>
            {userId}
            { slug }
            <pre>{JSON.stringify(matches, null, 2)}</pre>
        </div>
    )
}

export default LikeContainer