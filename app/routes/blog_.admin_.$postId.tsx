import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { ImageController } from '~/components/images/multi-image-controller'
import TipTap from '~/components/v2-components/tiptap/tip-tap'
import { H1, Muted } from '~/components/ui/typography'
import { Checkbox } from '~/components/ui/checkbox'
import CustomSelectBox from '~/components/v2-components/custom-select'
import { useCategories, validateAction } from '~/utilities'
import React from 'react'
import { getSession, setErrorMessage, commitSession, setSuccessMessage } from '~/server/session.server'
export async function loader ({ request, params }: LoaderFunctionArgs) {
  const { postId } = zx.parseParams(params, {

    postId: z.string()
  })

  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      categories: true,
      likes: true,
      favorites: true,
      postImages: true,
      _count: {
        select: {
          comments: true,
          likes: true
        }
      }
    }
  })

  return json({ post })
}


const editPostSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('setPrimaryImage'),
    postId: z.string(),
    imageUrl: z.string().url('Image URL should be a valid URL')
  })
])

type ActionInput = z.infer<typeof editPostSchema>
export async function action ({ request, params }: ActionFunctionArgs) {

  const { postId } = zx.parseParams(params, { postId: z.string() })
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
  const { formData, errors } = await validateAction({ request, schema: editPostSchema })

  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { intent } = formData as ActionInput

  if (intent === 'setPrimaryImage') {
    const { imageUrl } = formData as ActionInput
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        imageUrl
      }
    })
    if (!post) {
      setErrorMessage(session, 'Post not updated')
    } else {
      setSuccessMessage(session, `Post ${post.title} updated`)
      return json({ post }, {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      })
    }
  }


}

export default function BlogPost () {

  const { post } = useLoaderData<typeof loader>()
  const categories = useCategories()
  console.log(categories, 'categories')

  return (
    <div className='flex flex-col items-center justify-center w-full h-full px-4 py-6'>
      <H1>Edit Post</H1>
      {
        post && (
          <><ImageController postImages={ post?.postImages } postId={ post.id }
            primaryImage={ post.imageUrl }


          /><Form
            method='post'
            action={ `/blog/${post.id}/edit` }
            className='flex flex-col justify-center w-full max-w-2xl mx-auto my-6 gap-2 md:gap-5'
          >
              <Label htmlFor='title'>Title</Label>
              <Input
                type='text'
                name='title'
                id='title'
                className='w-full p-2 m-2 border border-gray-300 rounded-md'
                defaultValue={ post.title } />

              <Label htmlFor='description'>Description</Label>
              <Input
                type='text'
                name='description'
                id='description'
                placeholder='The descriptiong should be 25 to 160 characters long.'
                className='w-full p-2 m-2 border border-gray-300 rounded-md'
                defaultValue={ post.description } />
              <Label htmlFor='content'>Content</Label>
              <TipTap content={ post.content } />

              <Label htmlFor='primaryImage'>Primary Image</Label>
              <input type='hidden' name='imageUrl' value={ post.imageUrl || primaryPostImage } />

              { post.imageUrl ? (
                <img src={ post.imageUrl } alt={ post.title } className='w-full h-auto object-cover' />
              ) : (
                <div className='w-full h-48 bg-gray-300' />
              ) }

              <div className='flex flex-col justify-start w-full max-w-2xl mx-auto my-6'>
                <div className='items-top flex space-x-2'>
                  <Checkbox
                    name='featured'
                    id='featured'
                    defaultChecked={ post.featured } />
                  <div className='grid gap-1.5 leading-none'>
                    <Label htmlFor='featured'>Featured</Label>
                    <Muted>Featured posts will be displayed on the home page.</Muted>
                  </div>
                </div>
                <div className='items-top flex space-x-2'>
                  <Checkbox
                    name='published'
                    id='published'
                    defaultChecked={ post.published } />
                  <div className='grid gap-1.5 leading-none'>
                    <Label htmlFor='published'>Published</Label>
                    <Muted>Published posts will be visible to the public.</Muted>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-start w-full max-w-2xl mx-auto my-6'>
                <Label htmlFor='categories'>Categories</Label>
                <CustomSelectBox
                  name='categories'
                  multiple
                  creatable
                  actionPath='/categories'
                  options={ categories.map((cat) => cat.label) }
                  picked={ post.categories.map((cat) => cat.label) } />
              </div>
              <Button variant='secondary' type='submit'>
                Submit
              </Button>
            </Form></>
        )
      }

      <Outlet />


    </div>
  )
}
