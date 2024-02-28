import {
  CrossCircledIcon,
  StarFilledIcon,
  StarIcon
} from '@radix-ui/react-icons'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import { ImageIcon } from 'lucide-react'
import React from 'react'
import { flushSync } from 'react-dom'
import { useDropzone } from 'react-dropzone-esm'
import { ImageWithPlaceholder } from '~/components/images/image-with-placeholder'
import { useFileURLs } from '~/components/images/use-file-urls'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Muted } from '~/components/ui/typography'
import { useResetCallback } from '~/lib/useResetCallback'
import { cn } from '~/lib/utils'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/prisma.server'
import { Post } from '~/server/schemas/schemas'
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    throw new Error('Not authenticated')
  }

  const post = await prisma.post.findUnique({
    where: {
      id: 'clt5bdm5o0000l3jq5toua30r'
    },
    include: {
      postImages: true
    }
  })
  if (!post) {
    throw new Error('No post found')
  }

  return json({ user, post })
}

export default function Beta() {
  const { user, post } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col items-center  w-full h-full space-y-4'>
      <h1>Post</h1>
      <ImageController post={post} />
    </div>
  )
}

export type ImageControllerProps = {
  post: Pick<Post, 'id' | 'title' | 'imageUrl' | 'postImages'>
}
const ImageController = ({ post }: ImageControllerProps) => {
  const { postImages, id, title, imageUrl } = post

  const getFileUrl = useFileURLs()

  const formRef = React.useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])
const [primaryImage, setPrimaryImage] = React.useState<string | null>(imageUrl)
  const displayPendingFiles = pendingFiles.filter(
    (file) =>
      !post.postImages.some(
        (draftFile) => draftFile.filename === `${file.name.split('.')[0]}`
      )
  )

  const existingImages = post.postImages.map((image) => ({
    ...image,
    isNew: false
  }))

  useResetCallback(post.postImages, () => {
    // It might seem intuitive to clear the pending files when we do this
    // but we don't actually want to clear the pending file until the real one has loaded on screen
    // Otherwise it'll go blank for a second and that's not a great experience
  })

  const submit = useSubmit()

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onFileDialogOpen() {
      setErrorMessage('You can only upload one image at a time')
    },
    async onDrop(acceptedFiles) {
      try {
        if (inputRef.current) {
          // remove files from the real input
          inputRef.current.value = ''
        }

        const formData = formRef.current
          ? new FormData(formRef.current)
          : new FormData()

        const newFiles = acceptedFiles.filter((file) => {
          return !post.postImages.some(
            (existingImage) =>
              existingImage.filename === `${file.name.split('.')[0]}`
          )
        })
        // Append each file to the form data
        acceptedFiles.forEach((file, index) => {
          formData.append('imageField', file)
          formData.append(`file${index}`, file)
          formData.append(`filename${index}`, file.name)
        })

          formData.append('postId', id)
        // Send the form data to the server
        submit(formData, {
          method: 'POST',
          action: '/actions/cloudinary-upload',
          encType: 'multipart/form-data',
          navigate: false
        })

        setErrorMessage('')
        setPendingFiles((pendingFiles) => [...pendingFiles, ...newFiles])
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message)
        }

        setPendingFiles([])
      }
    },

    noClick: true
  })

    const handleDelete = ({
        image,
        postId
    }: {
            image: { id: string; imageUrl: string; filename: string; cloudinaryPublicId: string };
        postId: string;
   }) => {
  setPendingFiles((pendingFiles) => {
    return pendingFiles.filter(
      (file) => file.name.split('.')[0] !== image.filename
    );
  });
        setPrimaryImage((imageUrl) => {
            if (imageUrl === image.imageUrl) {
                return null;
            }
            return imageUrl;
        }
        );


  submit(
      {
        postId,
      imageId: image.id,
      imageUrl: image.imageUrl,
      cloudinaryPublicId: image.cloudinaryPublicId,
      intent: 'delete',
    },
    {
      method: 'DELETE',
      action: '/actions/cloudinary',
      navigate: false,
    }
  );
};

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt='user avatar'
            className='w-20 h-20 rounded-full'
          />
        ) : (
          <UserPlaceHolder className={'w-20 h-20 rounded-full'} />
        )}

        <Muted>This is the primary Image for the post</Muted>
      </CardContent>
      <CardFooter className='flex flex-col gap-4 w-full items-start'>
        <Muted>
          {postImages?.length === 1
            ? 'This post has 1 image'
            : `This post has ${postImages?.length} images`}
        </Muted>

        <Form
          ref={formRef}
          action='/actions/cloudinary-upload'
          method='POST'
          encType='multipart/form-data'
          {...getRootProps({
            className: cn('w-full h-fit', {
              'bg-primary-foreground': isDragActive,
              'bg-neutral-100': !isDragActive
            })
          })}
        >
          <input type='hidden' name='postId' value={id} />

          <Label htmlFor='imageField' className='block w-full items-center'>
            <div className='flex gap-2 cursor-pointer place-items-center rounded-md border-2 border-dashed px-4 py-6 md:py-12 text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-800 w-full justify-center'>
              <ImageIcon name='image' className='h-8 w-8' />
              <Input
                {...getInputProps()}
                ref={inputRef}
                type='file'
                name='imageField'
                id='imageField'
                multiple
                className='sr-only'
              />
              <Muted>Drag and drop an image here</Muted>
            </div>
          </Label>
              </Form>
                        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        <h3 className='underline mt-4'>User Images</h3>
        <div className='text-xs text-neutral-500 italic'>
          Click on the star to set or unset an image as the primary avatar.
          Click on the trash can to delete an image.
        </div>
        <div className='flex flex-wrap gap-4 mt-4'>
          {existingImages.map((image) => {
            const pendingFile = pendingFiles.find(
              (file) => file.name.split('.')[0] === image.filename
            )
            return (
              <FileImage
                key={image.cloudinaryPublicId}
                url={image.imageUrl}
                name={image.filename}
                cloudinaryPublicId={image.cloudinaryPublicId}
                isAvatar={imageUrl === image.imageUrl}
                    onDelete={
                        () => {
                            handleDelete({ image, postId: id});
                        }
                }
                onSetPrimary={() => {
                  // set primary image
                }}
              >
                <ImageWithPlaceholder
                  key={image.filename}
                  src={image.imageUrl}
                  className='mt-2 h-20 w-20 rounded-lg border-2 border-white ring-neutral-400 ring-offset-1 ring-2 hover:ring-primary-foreground'
                  placeholderSrc={
                    pendingFile ? getFileUrl(pendingFile) : undefined
                  }
                  onLoad={() => {
                    console.log('loaded', pendingFile)
                    setPendingFiles((pendingFiles) => {
                      return pendingFiles.filter((p) => p !== pendingFile)
                    })
                  }}
                />
              </FileImage>
            )
          }) }

                    {displayPendingFiles.map((file) => (
              <div
                className='relative mt-2 h-20 w-20 overflow-hidden rounded-lg border border-neutral-100'
                key={file.name}
              >
                <img
                  src={getFileUrl(file)}
                  alt='Uploaded file'
                  className='opacity-50'
                />
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  )
}

const FileImage = ({
  url,
  name,
  children,
  isAvatar,
  cloudinaryPublicId,
  onDelete = () => {},
  onSetPrimary = () => {}
}: {
  url: string
  name: string
  children: React.ReactNode
  isAvatar: boolean
  cloudinaryPublicId: string
  className?: string
  onDelete?: () => void
  onSetPrimary?: () => void
}) => {
  const [isHidden, setIsHidden] = React.useState(false)

  if (isHidden) return null

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this image?'
    )
    if (isConfirmed) {
      flushSync(() => {
        setIsHidden(true)
        onDelete()
      })
    }
  }

  return (
    <div className='group relative'>
      <input type='hidden' name='fileUrl' value={url} />
      <input type='hidden' name='fileName' value={name} />

      <input
        type='hidden'
        name='cloudinaryPublicId'
        value={cloudinaryPublicId}
      />
      {children}
      {/* // if you delete an image it falls back to the placeholder image */}
      <button
        type='button'
        onClick={handleDelete}
        className='absolute -right-[0.625rem] -top-[0.125rem]  rounded-full bg-white text-black/50 block text-black '
      >
        <CrossCircledIcon />
      </button>
      {/*         className='absolute -right-[0.625rem] -bottom-[0.125rem] hidden rounded-full  hover:block  group-hover:block'
       */}
      <button
        type='button'
        onClick={() => {
          if (onSetPrimary) {
            onSetPrimary()
          }
        }}
        className={cn(
          'absolute -right-[0.625rem] -bottom-[0.125rem] rounded-full',
          {
            ' bg-white text-black/50 hover:block text-black block': !isAvatar,
            ' block text-white group-block': isAvatar
          }
        )}
      >
        {isAvatar ? (
          <StarFilledIcon className='text-yellow-500' />
        ) : (
          <StarIcon />
        )}
      </button>
    </div>
  )
}
