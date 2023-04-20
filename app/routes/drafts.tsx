import type { LoaderArgs } from "@remix-run/node";
import { isAuthenticated } from "~/server/auth/auth.server";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/server/auth/prisma.server";
import { useLoaderData } from "@remix-run/react";
import { BlogPreview } from "./blog";
import type { Post } from "~/server/schemas/post-schema";
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    return redirect("/login");
  }
  const drafts = await prisma.post.findMany({
    where: {
      published: false,
      userId: user.id,
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true,
    },
  });
  if (!drafts) {
    return { json: { message: "No drafts found" } };
  }

  return json({ drafts });
}

export default function DraftsRoute() {
  const { drafts } = useLoaderData<{
    drafts: Post[];
  }>();
  return (
    <div className="">
      {drafts.map((draft: Post) => (
        <BlogPreview key={draft.id} post={draft} />
      ))}
    </div>
  );
}
