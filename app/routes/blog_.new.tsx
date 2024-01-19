import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useNavigation,
  useRouteError
} from '@remix-run/react'
import React from 'react'
import { z } from 'zod'
import ImageUploader from '~/components/v2-components/blog-ui/image-fetcher'
import { Button } from '~/components/ui/button'
import TipTap from '~/components/v2-components/tiptap/tip-tap'
import { isAuthenticated } from '~/server/auth/auth.server'
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage
} from '~/server/session.server'
import { createPost } from '~/server/post.server'
import { useCategories, validateAction } from '~/utilities'
import * as Switch from '@radix-ui/react-switch'
import SelectBox from '~/components/select'
import CustomSelectBox from '~/components/v2-components/custom-select'
export async function loader ({ request }: LoaderFunctionArgs) {
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
  return json({ user })
}
// make title a 60 character limit as google has a 60 character limit for titles in search results

export const schema = z.object({
  title: z.string().min(25, 'Title should be at least 25 characters').max(60),
  description: z
    .string()
    .min(25, 'Description should be at least 10 characters')
    .max(160, 'Description should be less than 160 characters'),
  imageUrl: z.string().url('Image URL should be a valid URL'),
  featured: z.coerce.boolean(),
  content: z.string().min(1).max(50000),
  categories: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action ({ request }: ActionFunctionArgs) {
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
  const { formData, errors } = await validateAction({ request, schema })
  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { title, description, content, imageUrl, featured, categories } =
    formData as ActionInput

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const post = await createPost({
    title,
    description,
    content,
    imageUrl,
    featured,
    slug,
    userId,
    categories: categories.split(',').map((cat) => {
      return {
        value: cat
      }
    })
  })

  if (!post) {
    setErrorMessage(session, `Could not create post`)
  } else {
    setSuccessMessage(session, `Post ${post.title} created`)
  }

  return redirect('/blog', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

export default function NewPostRoute () {
  const actionData = useActionData<{ errors: ActionInput }>()
  const [url, setUrl] = React.useState('')

  const navigation = useNavigation()
  const text =
    navigation.state === 'submitting'
      ? 'Saving...'
      : navigation.state === 'loading'
        ? 'Saved!'
        : 'Save'

  const categories = useCategories()
  // const categories = allcategories.map((cat) => cat.value)

  return (
    <div className=' mx-auto flex h-full w-full flex-col p-1'>
      <ImageUploader setUrl={ setUrl } />

      <Form className='flex w-full  flex-col ' method='post'>
        <input
          type='hidden'
          className='rounded-xl text-black'
          name='imageUrl'
          value={ url }
        />
        <label htmlFor='title'>Title</label>
        <input
          className='rounded-md border text-sm text-black'
          id='title'
          name='title'
          type='text'
          placeholder='Title'
          defaultValue={ actionData?.errors?.title }
          aria-invalid={ Boolean(actionData?.errors?.title) || undefined }
          aria-errormessage={
            actionData?.errors?.title ? 'title-error' : undefined
          }
          onChange={ (e) => console.log(e.target.value) }
        />
        { actionData?.errors?.title && (
          <p id='title-error' className='text-red-500'>
            { actionData?.errors?.title }
          </p>
        ) }
        <label htmlFor='description'>Description</label>
        <input
          type='text'
          className='rounded-md border text-sm text-black'
          placeholder='Description...'
          name='description'
          defaultValue={ actionData?.errors?.description }
          aria-invalid={ Boolean(actionData?.errors?.description) || undefined }
          aria-errormessage={
            actionData?.errors?.description ? 'description-error' : undefined
          }
          onChange={ (e) => console.log(e.target.value) }
        />
        { actionData?.errors?.description && (
          <p id='description-error' role='alert' className='text-red-500'>
            { actionData?.errors?.description }
          </p>
        ) }

        <label htmlFor='content'>Content</label>

        <TipTap />

        <label htmlFor='categories'>Categories</label>
        {/* <SelectBox
          multiple
          name='categories'
          options={categories}
          picked={[]}
        /> */}
        <CustomSelectBox
          name='categories'
          multiple={ true }
          options={ categories.map((cat) => cat.value) }
          picked={ [] }
          creatable={ true }
          actionPath='/categories'
        />

        { actionData?.errors?.categories && (
          <p id='categories-error' role='alert' className='text-red-500'>
            { actionData?.errors?.categories }
          </p>
        ) }
        <label htmlFor='featured'>Featured</label>
        <Switch.Root
          className='bg-blackA9 shadow-blackA7 relative h-[25px] w-[42px] cursor-default rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black'
          id='featured'
          name='featured'
          style={ { WebkitTapHighlightColor: 'transparent' } }
        >
          <Switch.Thumb className='shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]' />
        </Switch.Root>
        <div className='flex justify-center'>
          <Button variant='default' type='submit'>
            { text }
          </Button>
        </div>
      </Form>
    </div>
  )
}

export function ErrorBoundary () {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>oops</h1>
        <h1>Status:{ error.status }</h1>
        <p>{ error.data.message }</p>
      </div>
    )
  }
  let errorMessage = 'unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  }
  return (
    <div>
      <h1 className='text-2xl font-bold'>uh Oh..</h1>
      <p className='text-xl'>
        something went wrong This is the error boundry for a new blog post
      </p>
      <pre>{ errorMessage }</pre>
    </div>
  )
}
