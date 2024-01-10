import type { LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node';
import { zx } from 'zodix';
import { z } from 'zod';
import { prisma } from '~/server/prisma.server';
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
            _count: {
                select: {
                    comments: true,
                    likes: true
                }
            }
        }
    })

    return json({ post })
}
