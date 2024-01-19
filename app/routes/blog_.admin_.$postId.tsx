import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { prisma } from '~/server/prisma.server'
import { Form, Outlet, useLoaderData, useParams } from '@remix-run/react'
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
import { cloudUpload } from '~/server/cloudinary.server'
import { file } from 'zod-form-data'
import { useFileURLs } from '~/components/images/use-file-urls'
import { useDropzone } from 'react-dropzone-esm'
import { ImageIcon } from 'lucide-react'
import { PostImage } from '~/server/schemas/images.schema'
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

    }
  })

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


const editPostSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('setPrimaryImage'),
    postId: z.string(),
    imageUrl: z.string().url('Image URL should be a valid URL')
  }),
  z.object({
    intent: z.literal('imageUpload'),
    postId: z.string().optional()

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

  const cloned = request.clone()
  const { formData, errors } = await validateAction({ request: cloned, schema: editPostSchema })

  if (errors) {
    return json({ errors }, { status: 422 })
  }

  const { intent } = formData as ActionInput

  if (intent === 'setPrimaryImage') {
    // this is cheating
    const { imageUrl } = formData as ActionInput & { imageUrl: string }
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
  } if (intent === 'imageUpload') {
    const imagegResults = await cloudUpload(request.clone())
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        postImages: {
          create: imagegResults.map((image) => {
            return {
              cloudinaryPublicId: image.public_id,
              imageUrl: image.secure_url,
              filename: image.original_filename,
              postId,
            }
          })
        },
      },
      include: {
        postImages: true
      }
    })

    const images = post?.postImages.map((image) => {
      return {
        ...image,
      }

    }
    )
    console.log(images, 'images');

    const directImages = await prisma.postImage.findMany({
      where: {
        postId: postId
      }
    })

    console.log(directImages, 'directImages');

    return json({ post, images })
  }


}

export default function BlogPost () {
  const params = useParams()
  const postId = params.postId
  const { post, images } = useLoaderData<typeof loader>()
  const categories = useCategories()

  const getFileUrl = useFileURLs()

  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])
  const [uploadedImages, setUploadedImages] = React.useState<PostImage[]>([])
  const displayPendingFiles = pendingFiles.filter(
    (file) => !images?.some((draftFile) => draftFile.filename === file.name),
  )
  const [errorMessage, setErrorMessage] = React.useState("")

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onFileDialogOpen () {
      setErrorMessage("")
    },
    async onDrop (acceptedFiles) {
      try {
        if (inputRef.current) {
          inputRef.current.value = ""

        }
        const fileAlreadyExists = acceptedFiles.some((file) => {
          const currentFiles = [, ...pendingFiles]
          return currentFiles.some((draftFile) => draftFile.filename === file.name)
        })

        if (fileAlreadyExists) {
          throw new Error("Duplicate file")
        }

        setErrorMessage("")
        setPendingFiles((pendingFiles) => [...pendingFiles, ...acceptedFiles])
      }
      catch (error) {
        setErrorMessage(error.message)
      }
    },
    noClick: true,
  })

  return (
    <div className='flex flex-col items-center justify-center w-full h-full px-4 py-6'>
      <H1>Edit Post</H1>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Form
          method='POST'
          encType='multipart/form-data'
          action={ `/blog/admin/${postId}` }
          navigate={ false }


        >
          <Label htmlFor='image'>Image</Label>
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
                style={ { display: "block" } }
                id="image-input"
                name="imageUrl"
                multiple
                type="file"
                className="sr-only"
              />
            </Label>

          </div>
          <input type='hidden' name='postId' value={ postId } />
          <Button
            className='w-full relative bottom-0'
            name='intent'
            value='imageUpload'
            variant='default' type='submit'>
            Upload
          </Button>
        </Form>
        <div className="flex flex-row flex-wrap gap-2">
          { images?.map((image) => {
            const pendingFile = pendingFiles.find(
              (file) => file.name === image.filename,
            )

            return (
              <div
                className="relative mt-2 h-20 w-20 overflow-hidden rounded-lg border border-neutral-100"
                key={ image.id }
              >
                <img
                  src={ getFileUrl(image.imageUrl) }
                  alt="Uploaded file"
                  className="opacity-50"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5 bg-neutral-900 bg-opacity-50">
                  <Button
                    variant="secondary"
                    onClick={ () => {
                      setPendingFiles((pendingFiles) =>
                        pendingFiles.filter((file) => file.name !== image.name),
                      )
                    } }
                  >
                    Remove
                  </Button>
                  { pendingFile && (
                    <div className="text-neutral-50">
                      { Math.round(pendingFile.progress) }%
                    </div>
                  ) }
                </div>
              </div>
            )
          }
          ) }
        </div>
        <div className="flex flex-row flex-wrap gap-2">

          {
            displayPendingFiles.map((file) => (
              <div
                className="relative mt-2 h-20 w-20 overflow-hidden rounded-lg border border-neutral-100"
                key={ file.name }
              >
                <img
                  src={ getFileUrl(file) }
                  alt="Uploaded file"
                  className="opacity-50"
                />
              </div>
            ))
          }

        </div>
        {
          post && (
            <><Form
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
              <input type='hidden' name='imageUrl' value={ post.imageUrl } />

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
    </div>
  )
}
