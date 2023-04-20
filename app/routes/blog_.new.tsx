import { Input, MultiSelect, Switch } from "@mantine/core";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useFetcher,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import React from "react";
import { useEffect } from "react";
import { z } from "zod";
import ImageUploader from "~/components/blog-ui/image-fetcher";
import Button from "~/components/button";
import TipTap from "~/components/tip-tap";
import { isAuthenticated } from "~/server/auth/auth.server";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/server/auth/session.server";
import { createPost } from "~/server/post.server";
import type { Category } from "~/server/schemas/post-schema";
import { validateAction } from "~/utilities";

export const schema = z.object({
  title: z.string().min(5, "Title should be at least 5 characters").max(100),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(100),
  imageUrl: z.string().url("Image URL should be a valid URL"),
  featured: z.coerce.boolean(),
  content: z.string().min(1).max(1000),
  categories: z.string(),
});

type ActionInput = z.infer<typeof schema>;
export async function action({ request }: ActionArgs) {
  // get the session from the request for toast messages
  const session = await getSession(request.headers.get("Cookie"));
  // check if the user is authenticated
  const user = await isAuthenticated(request);
  if (!user) {
    throw new Error(
      "You are not authenticated. Please login to create a new post"
    );
  }
  const userId = user.id;
  const { formData, errors } = await validateAction({ request, schema });
  if (errors) {
    return json({ errors }, { status: 422 });
  }

  const { title, description, content, imageUrl, featured, categories } =
    formData as ActionInput;

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cats = categories?.split(",");
  const category = cats.map((cat) => {
    return {
      value: cat,
    };
  });

  const post = await createPost({
    title,
    description,
    content,
    imageUrl,
    featured,
    slug,
    userId,
    categories: category,
  });

  if (!post) {
    setErrorMessage(session, `Could not create post`);
  } else {
    setSuccessMessage(session, `Post ${post.title} created`);
  }

  return redirect("/blog", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function NewPostRoute() {
  const actionData = useActionData<{ errors: ActionInput }>();
  const [url, setUrl] = React.useState("");

  const [selected, setSelected] = React.useState<string>("");

  const navigation = useNavigation();
  const text =
    navigation.state === "submitting"
      ? "Saving..."
      : navigation.state === "loading"
      ? "Saved!"
      : "Save";

  const { categories } = useRouteLoaderData("root") as {
    categories: Category[];
  };
  // fetch categories from the server
  const categoryFetcher = useFetcher();
  useEffect(() => {
    if (categoryFetcher.state === "idle" && categoryFetcher.data == null) {
      categoryFetcher.load("/categories");
    }
  }, [categoryFetcher]);

  return (
    <div className="flex flex-col h-full w-fit mx-auto p-1">
      <ImageUploader setUrl={setUrl} />

      <Form className="flex flex-col w-full" method="post">
        <input
          type="hidden"
          className="rounded-xl text-slate12"
          name="imageUrl"
          value={url}
        />
        <label htmlFor="title">Title</label>
        <Input
          className="rounded-md border text-sm text-slate12"
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          defaultValue={actionData?.errors?.title}
          aria-invalid={Boolean(actionData?.errors?.title) || undefined}
          aria-errormessage={
            actionData?.errors?.title ? "title-error" : undefined
          }
          onChange={(e) => console.log(e.target.value)}
        />
        {actionData?.errors?.title && (
          <p id="title-error" className="text-red-500">
            {actionData?.errors?.title}
          </p>
        )}
        <label htmlFor="description">Description</label>
        <Input
          type="text"
          className="rounded-md border text-sm text-slate12"
          placeholder="Description..."
          name="description"
          defaultValue={actionData?.errors?.description}
          aria-invalid={Boolean(actionData?.errors?.description) || undefined}
          aria-errormessage={
            actionData?.errors?.description ? "description-error" : undefined
          }
          onChange={(e) => console.log(e.target.value)}
        />
        {actionData?.errors?.description && (
          <p id="description-error" role="alert" className="text-red-500">
            {actionData?.errors?.description}
          </p>
        )}

        <label htmlFor="content">Content</label>

        <TipTap />
        <label htmlFor="categories">Categories</label>
        <div className="p-1">
          <MultiSelect
            shadow="xl"
            data={categories}
            onChange={(e) => {
              setSelected(e.join(","));
            }}
          />{" "}
          {actionData?.errors?.categories && (
            <p id="categories-error" role="alert" className="text-red-500">
              {actionData?.errors?.categories}
            </p>
          )}
          <label htmlFor="featured">Featured</label>
          <Switch
            name="featured"
            onChange={(e) => console.log(e.target.value)}
            defaultChecked={false}
          />
        </div>
        <input type="hidden" name="categories" value={selected} />
        <div className="flex justify-center">
          <Button variant="primary" type="submit">
            {text}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h1>Status:{error.status}</h1>
        <p>{error.data.message}</p>
      </div>
    );
  }
  let errorMessage = "unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">uh Oh..</h1>
      <p className="text-xl">something went wrong</p>
      <pre>{errorMessage}</pre>
    </div>
  );
}
