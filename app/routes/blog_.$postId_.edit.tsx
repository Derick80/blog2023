import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/auth/session.server'
import { z } from 'zod'
import { useMatchesData, validateAction } from '~/utilities'
import { prisma } from '~/server/auth/prisma.server'
import { updatePost } from '~/server/post.server'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate} from '@remix-run/react'
import type { Category } from '~/server/schemas/schemas'
import React from 'react'
import TipTap from '~/components/tip-tap'
import { Switch } from '@mantine/core'
import ImageUploader from '~/components/blog-ui/image-fetcher'
import Button from '~/components/button'
import SelectBox from '~/components/select'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const { postId } = zx.parseParams(params, { postId: z.string() })
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      categories: true
    }
  })
  if (!post) throw new Error('No post found')

  return json({ post })
}

const schema = z.object({
  title: z.string().min(5, 'Title should be at least 5 characters').max(100),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .max(1000),
  imageUrl: z.string().url('Image URL should be a valid URL'),
  featured: z.coerce.boolean(),
  content: z.string().min(1).max(50000),
  categories: z.string()
})

type ActionInput = z.infer<typeof schema>

export async function action({ request, params }: ActionArgs) {
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
  const userId = z.string().parse(user.id)
  const { postId } = zx.parseParams(params, { postId: z.string() })

  const { formData, errors } = await validateAction({ request, schema })
  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { title, description, content, imageUrl, featured, categories } =
    formData as ActionInput

  const category = categories.split(',').map((category) => {
    return {
      value: category
    }
  })

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const post = await updatePost({
    postId,
    title,
    description,
    content,
    imageUrl,
    featured,
    slug,
    categories: category,
    userId
  })

  if (!post) {
    setErrorMessage(session, 'Post not updated')
  } else {
    setSuccessMessage(session, `Post ${post.title} updated`)
    return redirect(`/blog`, {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    })
  }
}

export default function PostEdit() {
  // use Navigate to go back to the previous page
  const navigate = useNavigate()
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<{ errors: Record<string, string> }>()

  const parentData = useMatchesData('root') as {
    categories: Category[]
  }



  const [url, setUrl] = React.useState(data.post.imageUrl || '')

  return (
    <div className='mx-auto flex h-full w-fit flex-col p-1'>
      <Form id='post-edit' className='flex w-full flex-col' method='POST'>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          name='title'
          className='rounded-md border text-sm text-black'
          defaultValue={data.post.title}
          aria-invalid={Boolean(actionData?.errors?.title) || undefined}
          aria-errormessage={
            actionData?.errors?.title ? 'title-error' : undefined
          }
        />
        {actionData?.errors?.title && (
          <p id='title-error' className='text-red-500'>
            {actionData?.errors?.title}
          </p>
        )}
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          name='description'
          className='rounded-md border text-sm text-black'
          defaultValue={data.post.description}
          aria-invalid={Boolean(actionData?.errors?.description) || undefined}
          aria-errormessage={
            actionData?.errors?.description ? 'description-error' : undefined
          }
          onChange={(e) => console.log(e.target.value)}
        />
        {actionData?.errors?.description && (
          <p id='description-error' role='alert' className='text-red-500'>
            {actionData?.errors?.description}
          </p>
        )}

        <label htmlFor='content'>Content</label>
        <TipTap content={data.post.content} />
        {actionData?.errors?.content && (
          <p id='content-error' role='alert' className='text-red-500'>
            {actionData?.errors?.content}
          </p>
        )}

        <label htmlFor='categories'>Categories</label>
        <div className='p-1'>
          
          <SelectBox
            multiple
            name='categories'
          options={parentData.categories} picked={data.post.categories} />
        </div>

        <div className='text-slate12 mb-5 mt-5 flex flex-row items-center justify-end gap-2'>
          <label htmlFor='featured'>Featured</label>
          <Switch
            name='featured'
            id='featured'
            color='blue'
            defaultChecked={data.post.featured}
          />
        </div>
        <input
          type='text'
          className='text-slate12 rounded-xl'
          name='imageUrl'
          placeholder='Image URL'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <img src={url} alt={data.post.title} className='w-1/2' />
      </Form>
      <ImageUploader setUrl={setUrl} />
      <div className='text-slate12 flex flex-row items-center justify-end gap-2'>
        <Button
          form='post-edit'
          type='submit'
          name='action'
          value='update'
          variant='primary_filled'
          size='small'
        >
          Update
        </Button>
        <Button
          type='button'
          onClick={() => {
            navigate(-1)
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
