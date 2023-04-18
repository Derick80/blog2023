import type { LoaderArgs} from '@remix-run/node';
import { json } from '@remix-run/node'
import {  useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'
import { BlogPreview } from './blog'

export async function loader({request, params}:LoaderArgs){

    const {categoryName} = params
    if(!categoryName){
        return json({posts:[]})
    }
    const posts = await prisma.post.findMany({
        where:{
            published:true,
            categories:{
                some:{
                    value:categoryName
                }},
            },
        include:{
            user:true,
            likes:true,
            categories:true

            }
    })

    return json({posts})
}

export default function BlogRoute(){

        const {posts} = useLoaderData<typeof loader>()

        return (
            <div
                className='flex flex-col h-screen items-center border-2 w-full gap-4'
                >
{posts.map(post => (
                <BlogPreview
                    key={post.id}
                post={post} />
            ))}

                </div>
        )
    }
