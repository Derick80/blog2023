import cloudinary from 'cloudinary'
import type { UploadHandler } from '@remix-run/node'
import {
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  writeAsyncIterableToWritable
} from '@remix-run/node'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadImage(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        cloud_name: 'dch-photo',
        transformation: [
          {
            format: 'webp',
            fetch_format: 'webp'
          }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      }
    )
    await writeAsyncIterableToWritable(data, uploadStream)
  })

  return uploadPromise
}

// console.log('configs', cloudinary.v2.config())
export const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (name !== 'imageUrl') {
      return undefined
    }
    const uploadedImage = (await uploadImage(data)) as string
    // @ts-ignore
    // this ignore came from the source i followed.  I think I kinda solved this by adding the type to the uploadImage function
    return uploadedImage.secure_url
  },
  unstable_createMemoryUploadHandler()
)

export async function cloudUpload(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const imageUrl = formData.get('imageUrl' || '')
  return imageUrl
}

export const fetchSecureUrls = async () => {
  // Replace 'YOUR_BUCKET_NAME' with the name of your Cloudinary bucket
  const result = await cloudinary.v2.api.resources({
    type: 'upload',
    prefix: 'Japan_2023',
    max_results: 1000 // Adjust this number as per your needs
  })

  const secureUrls = result.resources.map(
    (resource: { secure_url: string }) => resource.secure_url
  )

  return secureUrls
}
