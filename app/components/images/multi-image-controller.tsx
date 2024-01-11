import { PostImage } from '~/server/schemas/images.schema'
import ImageWithPlaceholder from './images'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { Separator } from '../ui/separator'
import { Form, useFetcher } from '@remix-run/react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import React from 'react'

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

  const ImageUploadFetcher = useFetcher()

  const onFileChange = async () => {
    ImageUploadFetcher.submit({
      imageUrl: 'imageUrl',
      postId: postId,
      key: 'imageUrl',
      action: '/actions/cloudinary'
    })
    setReadyToUpload(true)
  }



  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1>Image Controller</h1>
      { postImages?.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          { postImages?.map((image) => (
            <ImageWithPlaceholder
              primaryPostImage={ primaryImage }
              key={ image.id }
              postId={ postId }
              src={ image.imageUrl }
              publicId={ image.cloudinaryPublicId }
              imageId={ image.id }
              className='w-full h-auto object-cover'
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
          <Input
            id='image'
            name='imageUrl'
            type='file'
            accept='image/*'
            multiple
            onBlur={ onFileChange }
          />
          <input type='hidden' name='postId' value={ postId } />
          <Button disabled={ !readyToUpload } variant='outline' type='submit'>
            Upload
          </Button>
        </Form>
      </div>
    </div>
  )
}
