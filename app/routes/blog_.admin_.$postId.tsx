import type { LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
import { Form, useLoaderData } from '@remix-run/react'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { ImageController } from '~/components/images/multi-image-controller'
import TipTap from '~/components/v2-components/tiptap/tip-tap'
import { H1, Muted } from '~/components/ui/typography'
import { Checkbox } from '~/components/ui/checkbox'
import CustomSelectBox from '~/components/v2-components/custom-select'
import { useCategories } from '~/utilities'
export async function loader({ request, params }: LoaderFunctionArgs) {
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

  if (!post) throw new Error('No post found')
  return json({ post })
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>()
  const { postImages } = post
  const categories = useCategories()
  console.log(categories, 'categories')

  return (
    <div className='flex flex-col items-center justify-center w-full h-full px-4 py-6'>
      <H1>Edit Post</H1>
      <ImageController postImages={postImages} postId={post.id} />
      <Form
        method='post'
        action={`/blog/${post.id}/edit`}
        className='flex flex-col justify-center w-full max-w-2xl mx-auto my-6 gap-2 md:gap-5'
      >
        <Label htmlFor='title'>Title</Label>
        <Input
          type='text'
          name='title'
          id='title'
          className='w-full p-2 m-2 border border-gray-300 rounded-md'
          defaultValue={post.title}
        />

        <Label htmlFor='description'>Description</Label>
        <Input
          type='text'
          name='description'
          id='description'
          placeholder='The descriptiong should be 25 to 160 characters long.'
          className='w-full p-2 m-2 border border-gray-300 rounded-md'
          defaultValue={post.description}
        />
        <Label htmlFor='content'>Content</Label>
        <TipTap content={post.content} />

        <div className='flex flex-col justify-start w-full max-w-2xl mx-auto my-6'>
          <div className='items-top flex space-x-2'>
            <Checkbox
              name='featured'
              id='featured'
              defaultChecked={post.featured}
            />
            <div className='grid gap-1.5 leading-none'>
              <Label htmlFor='featured'>Featured</Label>
              <Muted>Featured posts will be displayed on the home page.</Muted>
            </div>
          </div>
          <div className='items-top flex space-x-2'>
            <Checkbox
              name='published'
              id='published'
              defaultChecked={post.published}
            />
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
            options={categories.map((cat) => cat.label)}
            picked={post.categories.map((cat) => cat.label)}
          />
        </div>
        <Button variant='secondary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  )
}
