import { LinksFunction, LoaderArgs, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { isAuthenticated } from "./server/auth/auth.server";
import Layout from "./components/layout";
import stylesheet from "~/tailwind.css";
import {
  ToastMessage,
  commitSession,
  getSession,
} from "./server/auth/session.server";
import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { prisma } from "./server/auth/prisma.server";
import { User, UserType } from "./user-schema";
import { StylesPlaceholder } from "@mantine/remix";
import { MantineProvider } from "@mantine/core";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
// long story short I missed the if !toastMessage return so most of the time I was not returning my user because the message is blank.  This way, I think I'm able to use toast and also not have it refresh every time I navigate.
export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request);
  const categories = await prisma.category.findMany();
  const session = await getSession(request.headers.get("Cookie"));

  const toastMessage = (await session.get("toastMessage")) as ToastMessage;

  if (!toastMessage) {
    return json({ toastMessage: null, user, session, categories });
  }

  if (!toastMessage.type) {
    throw new Error("Message should have a type");
  }

  return json(
    { toastMessage, user, session, categories },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
export default function App() {
  const data = useLoaderData<typeof loader>();
  const { toastMessage, user } = data;
  console.log(user, "user");

  React.useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <StylesPlaceholder />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="">
          <Layout>
            <Outlet />
            <Toaster />

            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </Layout>
        </body>
      </html>
    </MantineProvider>
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
