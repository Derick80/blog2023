import { prisma } from "./auth/prisma.server";
import type { CategoryForm } from "./schemas/post-schema";

export type PostInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  userId: string;
  categories: CategoryForm;
};
export async function createPost(data: PostInput) {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      featured: data.featured,
      user: {
        connect: {
          id: data.userId,
        },
      },
      categories: {
        connectOrCreate: data.categories.map((category) => ({
          where: {
            value: category.value,
          },
          create: {
            value: category.value,
            label: category.value,
          },
        })),
      },
    },
  });
  return post;
}
