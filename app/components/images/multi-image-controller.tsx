import { PostImage } from '~/server/schemas/images.schema'
import { ImageWithPlaceholder } from './images'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { Separator } from '../ui/separator'
import { Form, useFetcher } from '@remix-run/react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import React from 'react'
import { useFileURLs } from './use-file-urls'
import { useDropzone } from 'react-dropzone-esm'
import { CircleBackslashIcon, ImageIcon } from '@radix-ui/react-icons'
export type ImageControllerProps = {
  postImages: PostImage[]
  postId: string
  primaryImage: string
}

export const ImageController = ({
  postImages,
  postId,
  primaryImage
}: ImageControllerProps) => {
  const [readyToUpload, setReadyToUpload] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const ImageUploadFetcher = useFetcher()

  const onFileChange = async () => {
    ImageUploadFetcher.submit({
      imageUrl: 'imageUrl',
      postId: postId,
      key: 'imageUrl',
      action: '/actions/cloudinary'
    })
    if (formRef.current) formRef.current.reset()
    setReadyToUpload(true)
  }

  const number = postImages?.length || 0
  console.log('number', number);


  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1>Image Controller</h1>
      { postImages?.length > 0 ? (
        <div className='grid grid-cols-3 grid-rows-auto gap-4 md:grid-cols-3 lg:grid-cols-4'>
          { postImages?.map((image) => (
            <ImageWithPlaceholder
              primaryPostImage={ primaryImage }
              key={ image.id }
              postId={ postId }
              src={ image.imageUrl }
              publicId={ image.cloudinaryPublicId }
              imageId={ image.id }
              placeholderSrc={
                'https://res.cloudinary.com/dch-photo/image/upload/v1662199076/samples/cloudinary-icon.png'
              }
            />
          )) }
        </div>
      ) : (
        <p>No images available.</p>
      ) }
      <Separator />
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Form
          method='POST'
          action='/actions/cloudinary'
          encType='multipart/form-data'
          navigate={ false }
          onChange={ onFileChange }

        >
          <Label htmlFor='image'>Image</Label>
          <FakeUpload />
          <input type='hidden' name='postId' value={ postId } />
          <Button
            className='w-full relative bottom-0'
            disabled={ !readyToUpload } variant='default' type='submit'>
            Upload
          </Button>
        </Form>

      </div>
    </div>
  )
}

export function FakeUpload () {
  const getFileUrl = useFileURLs()

  const [pendingFiles, setPendingFiles] = React.useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    async onDrop (acceptedFiles) {
      setPendingFiles((pendingFiles) => [...pendingFiles, ...acceptedFiles])
    },
    noClick: true,
  })

  return (
    <div>
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

      <div className="flex flex-row flex-wrap gap-x-2">
        { pendingFiles.map((file, index) => (
          <FakeUploadImage src={ getFileUrl(file) } key={ index } />
        )) }
      </div>
    </div>
  )
}

function FakeUploadImage ({ src }: { src: string }) {
  const [progress, setProgress] = React.useState(0)
  const [isHidden, setIsHidden] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => {
        if (progress <= 100) {
          return progress + Math.random() * 50
        }

        return progress
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  if (isHidden) return null

  return (
    <div className="group relative mt-2 h-20 w-20 rounded-lg border border-neutral-100">
      { progress <= 99 ? (
        <div
          className="absolute bottom-0 left-0 right-0 top-0 origin-top rounded-t-lg bg-black/50 transition-transform duration-300"
          style={ { transform: `scaleY(${(99 - progress) / 100.0})` } }
        />
      ) : null }

      <img src={ src } alt="Uploaded file" className="rounded-lg" />

      <button
        type="button"
        onClick={ () => {
          setIsHidden(true)
        } }
        className="absolute -right-[0.625rem] -top-2 hidden rounded-full bg-white text-black/50 hover:block hover:text-black group-hover:block"
      >
        <CircleBackslashIcon className="block h-6 w-6" />
      </button>
    </div>
  )
}