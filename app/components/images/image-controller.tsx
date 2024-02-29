import { Label } from '../ui/label'
import { CrossCircledIcon, ImageIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import { useSubmit, Form } from '@remix-run/react'
import React from 'react'
import { flushSync } from 'react-dom'
import { useDropzone } from 'react-dropzone-esm'
import { useResetCallback } from '~/lib/useResetCallback'
import { cn } from '~/lib/utils'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { Post } from '~/server/schemas/schemas'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Input } from '../ui/input'
import { Muted } from '../ui/typography'
import { ImageWithPlaceholder } from './image-with-placeholder'
import { useFileURLs } from './use-file-urls'
import { Editor } from '@tiptap/react'
import { PlusIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export type ImageControllerProps = {
  post: Pick<Post, 'id' | 'title' | 'imageUrl' | 'postImages'>,
  editor?: Editor,
  setImageLink?: React.Dispatch<React.SetStateAction<string>>
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}
const ImageController = ({ post ,editor,setImageLink,setOpen}: ImageControllerProps) => {
  const { postImages, id, title, imageUrl } = post



  const getFileUrl = useFileURLs()

  const formRef = React.useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])
  const [primaryImage, setPrimaryImage] = React.useState<string | null>(
    imageUrl
  )
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

  useResetCallback(post.imageUrl, () => {
    setPrimaryImage(post.imageUrl)
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

        const formData = new FormData()

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


  const addImage = React.useCallback(({ url }: {
    url: string
   }) => {


    if (
      editor && url
    ) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: `A image replacement for ${url}` })
        .run();

    }
  }, [editor,])

  console.log(editor,'editor');


  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Images for this Post</CardTitle>
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


                key={ image.id }
                url={image.imageUrl}
                name={image.filename}
                cloudinaryPublicId={image.cloudinaryPublicId}
                isAvatar={imageUrl === image.imageUrl}
                    onDelete={ () => {
                        submit(
                            {
                            postId: id,
                            imageId: image.id,
                            imageUrl: image.imageUrl,
                            cloudinaryPublicId: image.cloudinaryPublicId,
                            intent: 'delete'
                            },
                            {
                            method: 'POST',
                            action: '/actions/cloudinary',
                            navigate: false
                            }
                        )
                    }
                }
                onSetPrimary={() => {
                  setPrimaryImage(image.imageUrl)
                  submit(
                    {
                      postId: id,
                      imageId: image.id,
                      imageUrl: image.imageUrl,
                      isPrimary: imageUrl === image.imageUrl ? 'false' : 'true',
                      intent: 'setPrimary'
                    },
                    {
                      method: 'POST',
                      action: '/actions/cloudinary',
                      navigate: false
                    }
                  )
                } }
                onSetImageLink={() => {
                  if (setImageLink && setOpen) {
                    setImageLink(image.imageUrl);
                    addImage({ url: image.imageUrl });
                    setOpen(!setOpen);
                    toast.success(`${image.imageUrl} added to the editor`);



                }
                }
              }

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
          })}

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
          )) }
                    <div

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
        </div>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}


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
  onSetPrimary = () => { },
  onSetImageLink = () => { },
  editor,
}: {
  editor?: Editor,
  url: string
  name: string
  children: React.ReactNode
  isAvatar: boolean
  cloudinaryPublicId: string
  className?: string
  onDelete?: () => void
    onSetPrimary?: () => void
    onSetImageLink?: () => void
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
    const addImage = React.useCallback(({ url }: {
    url: string
   }) => {


    if ( url) {
      editor?.chain().focus().setImage({ src: url, alt: `A image replacement for ${url}` }).run()
    }
    }, [editor,])


  return (
    <div className='group relative'>
      <input type='hidden' name='fileUrl' value={url} />
      <input type='hidden' name='fileName' value={name} />

      <input
        type='hidden'
        name='cloudinaryPublicId'
        value={cloudinaryPublicId}
      />
      { children }
      {/* make a button to add an image to the text edtior */ }
      <button
        type='button'
        value='image'
        onClick={ () => {

          onSetImageLink();
          addImage({ url });
        }}
        className='absolute -left-[0.625rem] -top-[0.125rem] rounded-full bg-white text-black/50 block text-black'
      >
        <PlusIcon />
      </button>

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


export default ImageController