import { LoaderArgs, json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/auth/prisma.server'
import { Post } from '~/server/schemas/post-schema'

export async function loader({request}:LoaderArgs){

    const posts = await prisma.post.findMany({
        where:{
            published:true
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
console.log(posts, 'posts');

    return (
        <div
            className='flex flex-col h-screen items-center border-2 w-full'
        >

            <h1>Blog</h1>
{posts.map(post => (
                <BlogPreview
                    key={post.id}
                post={post} />
            ))}

        </div>
    )
}

function BlogPreview({post}:{post: Post}){
    return (
        <div
            className='flex flex-col h-screen items-center border-2 w-full'
        >
<Outlet />
            <h1>Blog</h1>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <Tags
                categories={post.categories}
            />
            <>{post.user.username}</>
        </div>
    )
}

function Tags({categories}:{categories: Post['categories']}){
    console.log(categories, 'categories');

        return (
            <div
                className='flex flex-row gap-2'
            >
                {categories.map(category => (
                    <div
                    className='border-2'
                        key={category.id}
                    >{category.value}</div>
                ))}
            </div>
        )
    }


