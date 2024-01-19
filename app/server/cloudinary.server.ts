import cloudinary from 'cloudinary'
import type { UploadHandler } from '@remix-run/node'
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  writeAsyncIterableToWritable,
  json
} from '@remix-run/node'
import { prisma } from './prisma.server'

export interface UploadResponse {
  asset_id: string
  public_id: string
  api_key: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: any[]
  pages: number
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  access_mode: string
  existing: boolean
  original_filename: string
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadImage(
  data: AsyncIterable<Uint8Array>,
  filename: string
): Promise<cloudinary.UploadApiResponse> {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        cloud_name: 'dch-photo',
        folder: 'blog_testing_2024',
        filename_override: filename,
        discard_original_filename: false,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        transformation: [
          {
            format: 'webp',
            fetch_format: 'webp',
            width: 250,
            height: 250,
            gravity: 'faces',
            crop: 'fill'
          }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (result) {
          resolve(result)
        } else {
          reject(new Error('No result returned from Cloudinary'))
        }
      }
    )

    // Handling async data writing to the upload stream
    writeAsyncIterableToWritable(data, uploadStream).catch(reject)
  })

  return uploadPromise as Promise<cloudinary.UploadApiResponse>
}

// console.log('configs', cloudinary.v2.config())
export const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
  async ({ name, data, filename }) => {
    if (name !== 'imageUrl') {
      return undefined
    }
    // if (!filename) {
    //   throw new Error("Missing 'filename' in upload request")
    // }

    const uploadedImage = await uploadImage(data, filename)
    // @ts-ignore
    // this ignore came from the source i followed.  I think I kinda solved this by adding the type to the uploadImage function
    console.log('uploadedImage', uploadedImage)

    return JSON.stringify(uploadedImage)
  },
  unstable_createMemoryUploadHandler()
)

export async function cloudUpload(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const imageResults = formData
    .getAll('imageUrl')
    .map((image) => {
      if (typeof image === 'string') {
        return JSON.parse(image)
      }
      return null
    })
    .filter((image) => image !== null)

  return imageResults
}

// delete image from cloudinary using secure_url

export const deleteImage = async ({
  pId,
  imageId
}: {
  pId: string
  imageId: string
}) => {
  const publicId = pId
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId)
    if (result.result === 'ok') {
      // delete image from db
      console.log('deteling image from db')

      const deleted = await prisma.postImage.delete({
        where: {
          id: imageId
        }
      })
      return deleted
    }
  } catch (error) {
    console.log('Error deleting image', error)
  }
}
