import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { z } from 'zod'
import { useMatchesData, validateAction } from '~/utilities'
import { prisma } from '~/server/prisma.server'
import { updatePost } from '~/server/post.server'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate
} from '@remix-run/react'
import type { Category } from '~/server/schemas/schemas'
import React from 'react'
import TipTap from '~/components/v2-components/tiptap/tip-tap'
import ImageUploader from '~/components/v2-components/blog-ui/image-fetcher'
import Button from '~/components/button'
import SelectBox from '~/components/select'
import * as Switch from '@radix-ui/react-switch'
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
      <div className='flex items-center justify-between'>
        {data.post.content}
      </div>
      <Form
        id='post-edit'
        className='flex h-full w-full flex-col bg-violet4 dark:bg-violet4_dark'
        method='POST'
      >
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
          onChange={void 0}
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
            options={parentData.categories}
            picked={data.post.categories}
          />
        </div>

        <div className='text-slate12 mb-5 mt-5 flex flex-row items-center justify-end gap-2'>
          <label htmlFor='featured'>Featured</label>
          <Switch.Root
            className='bg-blackA9 shadow-blackA7 relative h-[25px] w-[42px] cursor-default rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black'
            id='featured'
            name='featured'
          >
            <Switch.Thumb className='shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]' />
          </Switch.Root>
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
