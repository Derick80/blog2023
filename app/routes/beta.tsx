import { ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { ShouldRevalidateFunction, useLoaderData } from '@remix-run/react'
import MarkdownEditorDiy from '~/components/beta/markdown-editor-diy'
import ImageController from '~/components/images/image-controller'
import { isAuthenticated } from '~/server/auth/auth.server'
import { getImages } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'
import { processMarkdownToHtml } from '~/server/markdown.server'
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  if (currentUrl.pathname === nextUrl.pathname) {
    return false
  }
  return true
}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')

  }
const content = 'Hello from the server!'


  return json({ user, content })
}

export async function action ({
  params,
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData()
  const content = formData.get("content")?.toString() || ""
console.log(content,'content server side');

  const html = await processMarkdownToHtml(content)
  console.log(html,'html server side');

  // Optionally, store this in a database
  // const id = params.id as string
  // db[id].content = content.toString()
  // db[id].preview = html.content
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  })
}

export default function Beta () {
  const { user, content } = useLoaderData<typeof loader>()



  return (
    <div className='flex flex-col items-center  w-full h-full space-y-4'>
      <h1>Post</h1>

      <MarkdownEditorDiy
        content={ content }
      />
    </div>
  )
}
