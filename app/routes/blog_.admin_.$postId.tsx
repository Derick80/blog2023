import type { LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node';
import { zx } from 'zodix';
import { z } from 'zod';
import { prisma } from '~/server/prisma.server';
import { Form, useLoaderData } from '@remix-run/react';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ImageController } from '~/components/images/multi-image-controller';
export async function loader ({ request, params }: LoaderFunctionArgs) {

    const { postId } = zx.parseParams(params, {
        postId: z.string(


        )
    })

    const user = await isAuthenticated(request);
    if (!user) {
        return redirect('/login')
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            categories: true,
            likes: true,
            favorites: true,
            postImages: true,
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        }
    })

    if (!post) throw new Error('No post found')
    return json({ post })
}

export default function BlogPost () {
    const { post } = useLoaderData<typeof loader>()
    const { postImages } = post

    return (
        <div
            className="flex flex-col items-center justify-center w-full h-full">
            <ImageController postImages={ postImages } postId={ post.id }
            />
            <Form
                method="post"
                action={ `/blog/${post.id}/edit` }
                className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="title" className="text-xl font-bold">Title</Label>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.title }
                    />

                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="description" className="text-xl font-bold">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        id="description"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.description }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="content" className="text-xl font-bold">Content</Label>
                    <Input
                        type="text"
                        name="content"
                        id="content"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.content }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="imageUrl" className="text-xl font-bold">Image Url</Label>
                    <Input
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.imageUrl }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="featured" className="text-xl font-bold">Featured</Label>
                    <Input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultChecked={ post.featured }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="published" className="text-xl font-bold">Published</Label>
                    <Input
                        type="checkbox"
                        name="published"
                        id="published"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultChecked={ post.published }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="categories" className="text-xl font-bold">Categories</Label>
                    <Input
                        type="text"
                        name="categories"
                        id="categories"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.categories }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="userId" className="text-xl font-bold">User Id</Label>
                    <Input
                        type="text"
                        name="userId"
                        id="userId"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.userId }
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full">
                    <Label htmlFor="createdAt" className="text-xl font-bold">Created At</Label>
                    <Input
                        type="text"
                        name="createdAt"
                        id="createdAt"
                        className="w-full p-2 m-2 border border-gray-300 rounded-md"
                        defaultValue={ post.createdAt }
                    />
                </div>
                <Button type="submit">Submit</Button>

            </Form>
        </div>


    )
}