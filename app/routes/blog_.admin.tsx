import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect
} from '@remix-run/node'
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { H2 } from '~/components/ui/typography'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { validateAction } from '~/utilities'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'Unauthorized')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return json({ posts, user })
}

const createPostSchema = z.object({
  title: z.string().min(5, 'Title should be at least 5 characters').max(60)
})

type ActionInput = z.infer<typeof createPostSchema>
export async function action({ request }: ActionFunctionArgs) {
  // get the session from the request for toast messages
  const session = await getSession(request.headers.get('Cookie'))
  // check if the user is authenticated
  const user = await isAuthenticated(request)
  if (!user) {
    setErrorMessage(session, 'You must be logged in as an admin to do that')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
  const userId = user.id

  const { formData, errors } = await validateAction({
    request,
    schema: createPostSchema
  })
  if (errors) {
    return json(errors, { status: 400 })
  }
  const { title } = formData as ActionInput

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      description: '',
      content: '',
      imageUrl: '',
      featured: false,
      userId,
      published: false
    }
  })

  if (!post) {
    setErrorMessage(session, `Could not create post`)
  } else {
    setSuccessMessage(session, `Post ${post.title} created`)
  }

  return redirect(`/blog/admin/${post.id}`, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function BlogAdmin() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <div className='grid gap-5 items-center max-w-xl mx-auto'>
      <h1>Manage Blog Posts</h1>
      <h2>Create a new Post</h2>
      <Form method='POST'>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' name='title' type='text' />
        <Button type='submit'>Submit</Button>
      </Form>
      {posts.map((post) => (
        <div key={post.id} className='flex flex-col gap-10 border-2 w-full'>
          <H2>{post.title}</H2>
          <div className='flex flex-row items-center gap-10'>
            <h3>Title:</h3>
            <h3>Action</h3>
          </div>

          <div className='flex flex-row items-center gap-10'>
            <h2>{post.title}</h2>
            <Button variant='destructive'>Delete</Button>
          </div>

          <NavLink to={`/blog/admin/${post.id}`}>{post.title}</NavLink>
        </div>
      ))}

      <Outlet />
    </div>
  )
}
