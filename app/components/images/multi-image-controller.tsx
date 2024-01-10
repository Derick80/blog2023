import { PostImage } from '~/server/schemas/images.schema'
import ImageWithPlaceholder from './images'
import { UserPlaceHolder } from '~/resources/user-placeholder'
import { Separator } from '../ui/separator'
import { Form, useFetcher } from '@remix-run/react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export type ImageControllerProps = {
    postImages: PostImage[]
    postId: string
}

export const ImageController = (
    {
        postImages,
        postId
    }: ImageControllerProps) => {
    const ImageUploadFetcher = useFetcher()

    const onFileChange = async () => {
        ImageUploadFetcher.submit({
            imageUrl: 'imageUrl',
            postId: postId,
            key: 'imageUrl',
            action: '/actions/cloudinary'
        })
    }


    return (

        <div className='max-w-lg mx-auto p-4'>
            <h1>Image Controller</h1>
            { postImages?.length > 0 ? (
                <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>

                    { postImages?.map((image) => (
                        <ImageWithPlaceholder key={ image.id }
                            postId={ image.postId }
                            src={ image.imageUrl }
                            publicId={ image.cloudinaryPublicId }
                            imageId={ image.id }
                            className='w-full h-auto object-cover'
                            placeholderSrc={
                                'https://res.cloudinary.com/dch-photo/image/upload/v1662199076/samples/cloudinary-icon.png'
                            }


                        />
                    ))
                    }
                </div>
            ) : <p>No images available.</p>

            }
            <Separator />
            <Form method='POST'
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
                    className='block w-full text-sm text-gray-500'

                />
                <input type='hidden' name='postId'
                    value={ postId }
                />
                <button
                    type='submit'>Upload</button>
            </Form>
        </div>
    )
}