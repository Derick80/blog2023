import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
import { Form, Outlet, useFetcher, useLoaderData, useParams, useSubmit } from '@remix-run/react'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { ImageController } from '~/components/images/multi-image-controller'
import TipTap from '~/components/tiptap/tip-tap'
import { H1, Muted } from '~/components/ui/typography'
import { Checkbox } from '~/components/ui/checkbox'
import CustomSelectBox from '~/components/custom-select'
import { useCategories, validateAction } from '~/utilities'
import React from 'react'
import { getSession, setErrorMessage, commitSession, setSuccessMessage } from '~/server/session.server'
import { cloudUpload } from '~/server/cloudinary.server'
import { file } from 'zod-form-data'
import { useFileURLs } from '~/components/images/use-file-urls'
import { useDropzone } from 'react-dropzone-esm'
import { ImageIcon } from 'lucide-react'
import { PostImage } from '~/server/schemas/images.schema'
import { ImageWithPlaceholder } from '~/components/images/images'
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

      postImages: true,

    }

  })

  if (!post) throw new Error('No post found')

  const images = post?.postImages.map((image) => {
    return {
      ...image,
    }

  }
  )

  const directImages = await prisma.postImage.findMany({
    where: {
      postId: postId
    }
  })


  return json({ post, images })
}

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



}

export default function BlogPost () {
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])
  const params = useParams()
  const postId = params.postId
  const { post, images } = useLoaderData<typeof loader>()
  const categories = useCategories()
  const getFileUrl = useFileURLs()
  const imageToUploadFetcher = useFetcher()


  const onChange = async () => {
    await imageToUploadFetcher.submit({
      imageUrl: 'imageUrl',
      action: '/actions/cloudinary_v2'
    })
  }
  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    async onDrop (acceptedFiles) {
      imageToUploadFetcher.submit({
        postId: post.id,
        key: 'image',
        actrion: '/actions/cloudinary_v2',
      })
      setPendingFiles((acceptedFiles) => [...acceptedFiles, ...acceptedFiles])

    },
    noClick: true,
  })

  return (
    <>
      <imageToUploadFetcher.Form
        method='POST'
        action='/actions/cloudinary_v2'
        encType='multipart/form-data'
        onChange={ onChange }
      >
        <div
          { ...getRootProps({
            className: isDragActive ? "bg-neutral-50" : "",
          }) }
        >
          <Label htmlFor="image-input" className="block">
            <div className="grid cursor-pointer place-items-center rounded-md border-2 border-dashed px-4 py-12 text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-800">
              <ImageIcon name="image" className="h-8 w-8" />
              <span> Drop images here </span>
            </div>

            <Input
              { ...getInputProps() }
              id='imageUrl'
              name="imageUrl"
              multiple
              type="file"
              className="sr-only"
              accept='image/*'
            />
          </Label>
          <input type='hidden' name='postId' value={ postId } />
          <Button type='submit' variant='default' className='mt-2'>
            Upload
          </Button>
        </div>
      </imageToUploadFetcher.Form>
      { pendingFiles.map((blob, index) => (
        <ImageWithPlaceholder
          key={ index }
          src={ getFileUrl(blob) }
          alt={ blob.name }
        />

      )) }
      {
        images.map((image) => (
          <ImageWithPlaceholder
            key={ image.id }
            src={ image.imageUrl }
            alt={ image.filename }
          />
        ))
      }
    </>
  )
}
