import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import BlogPreviewCard from '~/components/blog-ui/post/blog-preview-card';
import { isAuthenticated } from '~/server/auth/auth.server';
import { getAllUserDraftsV1 } from '~/server/post.server';
import { Post } from '~/server/schemas/schemas';

export async function loader ({ request }: LoaderFunctionArgs) {
    const user = await isAuthenticated(request)
    if (!user) throw new Error("Unauthorized");


    const drafts = await getAllUserDraftsV1(user.id)

    if (!drafts) throw new Error("No drafts found");

    console.log(drafts, 'drafts from loader');
    return json({ drafts })
}

export default function BlogDraftsRoute () {
    const { drafts } = useLoaderData<{ drafts: Omit<Post, "comments">[] }>()

    return (
        <div

            className='flex flex-col md:flex-row md:flex-wrap gap-2'
        >
            { drafts?.map((post: Omit<Post, "comments">) => (
                <BlogPreviewCard key={ post.id } post={ post } />
            )) }
        </div>
    )
}