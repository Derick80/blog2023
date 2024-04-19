import { useMatches } from '@remix-run/react'
import { useOptionalUser } from '~/lib/functions'

export type LikeContainerProps = {
    slug: string
}
const LikeContainer = ({ slug }: { slug: string }) => {
    const user = useOptionalUser()
    if (!user) return null
    const userId = user.id

    const matches = useMatches()

    return (
        <div>
            {userId}
            {slug}
            <pre>{JSON.stringify(matches, null, 2)}</pre>
        </div>
    )
}

export default LikeContainer
