import { LoaderArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'

export async function loader({request, params}:LoaderArgs){
    const postId = params.postId
console.log(postId);

    return json({postId})
}

export default function BlogRoute(){
const data = useLoaderData<typeof loader>()
    return(
        <div>
            <h1>Blog</h1>
        </div>
    )
}