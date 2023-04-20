import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { ScrollToTop } from "~/components/scroll-to-top";
import Tags from "~/components/tags";
import { prisma } from "~/server/auth/prisma.server";
import type { Post } from "~/server/schemas/post-schema";
import { useOptionalUser } from "~/utilities";
// remember to change published to false
export async function loader({ request }: LoaderArgs) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true,
    },
  });

  return json({ posts });
}

export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-screen items-center border-2 w-full gap-4">
      <h1 className="text-4xl font-semibold">Blog</h1>
      <Outlet />
      {posts.map((post) => (
        <BlogPreview key={post.id} post={post} />
      ))}
      <ScrollToTop />
    </div>
  );
}

export function BlogPreview({ post }: { post: Post }) {
  return (
    <div className="flex static flex-col gap-2 border-2 w-full">
      {/* Card header */}
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-4xl font-semibold">{post.title}</h1>
      </div>
      {/* card content and image */}
      <div className="flex flex-row gap-2 border-2 border-red-500">
        <img src={post.imageUrl} alt={post.title} className="w-1/2" />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      {/* tags container */}

      <Tags categories={post.categories} />
      {/* card footer */}
      <div className="flex flex-row gap-2 border-2 border-green-500">
        <p>{post.user.username}</p>
        <p>{post.likes.length}</p>
      </div>
      {/* card actions */}
      <div className="flex flex-row gap-2 border-2 border-yellow-500">
        <Actions postId={post.id} userId={post.user.id} />
      </div>
    </div>
  );
}

function Actions({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: Post["userId"];
}) {
  const user = useOptionalUser();
  return (
    <div className="flex flex-row gap-2">
      <Link to={`/blog/${postId}`}>View</Link>
      {user?.id === userId && (
        <>
          <Link to={`/blog/${postId}/edit`}>Edit</Link>
          <Form method="post" action={`/blog/${postId}/delete`}>
            <button type="submit">Delete</button>
          </Form>
        </>
      )}
    </div>
  );
}
