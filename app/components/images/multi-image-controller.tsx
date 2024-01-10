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

        <div
            className='grid gap-5 items-center max-w-lg mx-auto'>
            <h1>Image Controller</h1>
            { postImages?.length > 0 ? (
                postImages?.map((image) => (
                    <ImageWithPlaceholder key={ image.id }
                        src={ image.imageUrl }
                        placeholderSrc={
                            'https://res.cloudinary.com/dch-photo/image/upload/v1662199076/samples/cloudinary-icon.png'
                        }


                    />
                ))
            ) : null

            }
            <Separator />
            <Form method='POST'
                action='/actions/cloudinary'
                encType='multipart/form-data'
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
                <input type='hidden' name='postId'
                    value={ postId }
                />
                <button type='submit'>Upload</button>
            </Form>
        </div>
    )
}