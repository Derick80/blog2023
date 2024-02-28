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
  filename?: string
): Promise<cloudinary.UploadApiResponse> {
  const uploadPromise = new Promise<cloudinary.UploadApiResponse>(
    async (resolve, reject) => {
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
              crop: 'scale',
              width: 1080,
              height: 1020
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
    }
  )

  return uploadPromise as Promise<cloudinary.UploadApiResponse>
}

// console.log('configs', cloudinary.v2.config())
export const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
  async ({ name, data, filename }) => {
    if (name !== 'imageField') {
      return undefined
    }

    const uploadedImage = await uploadImage(data, filename)
    if (!uploadedImage) throw new Error('No uploaded image')
    // @ts-ignore
    // this ignore came from the source i followed.  I think I kinda solved this by adding the type to the uploadImage function
    console.log(
      'uploadedImage from uploadHandler',
      JSON.stringify(uploadedImage)
    )

    return JSON.stringify(uploadedImage)
  },
  unstable_createMemoryUploadHandler()
)

export async function cloudUpload(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const postId = formData.get('postId') as string
  if (!postId) throw new Error('No post id')

  const imageResults = formData
    .getAll('imageField')
    .map((image) => {
      if (typeof image === 'string') {
        return JSON.parse(image)
      }
      return null
    })
    .filter((image) => image !== null)
    .map((image) => {
      return {
        postId: postId,
        cloudinaryPublicId: image.public_id,
        imageUrl: image.secure_url,
        filename: image.original_filename.split('.')[0]
      }
    })
  if (!imageResults) throw new Error('No image results')
  console.log(
    imageResults,
    'imageResults from cloudUpload in cloudinary.server'
  )

  const priorImages = await prisma.postImage.findMany({
    where: {
      postId
    },
    select: {
      cloudinaryPublicId: true
    }
  })

  const imagesToUpload = imageResults.filter((image) => {
    return !priorImages.some((priorImage) => {
      return priorImage.cloudinaryPublicId === image.cloudinaryPublicId
    })
  })
  return await saveToPost({ imagesToUpload, postId })
}

type SaveToPost = {
  postId: string
  imagesToUpload: {
    cloudinaryPublicId: string
    imageUrl: string
    filename: string
    postId: string
  }[]
}

export const saveToPost = async ({ imagesToUpload, postId }: SaveToPost) => {
  return await prisma.postImage.createMany({
    data: imagesToUpload.map((image) => {
      return {
        postId: postId,
        cloudinaryPublicId: image.cloudinaryPublicId,
        imageUrl: image.imageUrl,
        filename: image.filename
      }
    }),
    skipDuplicates: true
  })
}

// delete image from cloudinary using secure_url

export const deleteImage = async ({
  cloudinaryPublicId,
  imageId,
  postId,
  imageUrl
}: {
  cloudinaryPublicId: string
  imageId: string
  postId: string
  imageUrl: string
}) => {
  const deletedImage = (await cloudinary.v2.uploader.destroy(
    cloudinaryPublicId
  )) as { result: string }
  console.log('deletedImage', deletedImage)
  const isPrimaryImage = await prisma.post.findFirst({
    where: {
      id: postId,
      imageUrl
    },
    select: {
      imageUrl: true
    }
  })

  if (deletedImage.result === 'ok') {
    if (isPrimaryImage !== null) {
      return await prisma.post.update({
        where: {
          id: postId
        },
        data: {
          imageUrl: '',
          postImages: {
            delete: {
              id: imageId
            }
          }
        }
      })
    }
    if (isPrimaryImage === null) {
      return await prisma.postImage.delete({
        where: {
          id: imageId
        }
      })
    }
  }
  if (deletedImage.result !== 'ok') {
    throw new Error('Image not deleted')
  }
}

export const setPrimaryImage = async ({
  postId,
  imageId,
  imageUrl
}: {
  postId: string
  imageId: string
  imageUrl: string
}) => {
  console.log('postId', postId, 'imageId', imageId, 'imageUrl', imageUrl)

  const isPrimary = await prisma.postImage.findFirst({
    where: {
      id: imageId,
      isPrimary: true
    },
    select: {
      isPrimary: true
    }
  })
  console.log('isPrimary', isPrimary)

  if (isPrimary) {
    return await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        imageUrl: '',
        postImages: {
          update: {
            where: {
              id: imageId
            },
            data: {
              isPrimary: false
            }
          }
        }
      },
      select: {
        imageUrl: true,
        id: true,
        postImages: true
      }
    })
  }
  if (!isPrimary) {
    return await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        imageUrl,
        postImages: {
          updateMany: {
            where: {
              id: {
                not: imageId
              }
            },
            data: {
              isPrimary: false
            }
          },
          update: {
            where: {
              id: imageId
            },
            data: {
              isPrimary: true
            }
          }
        }
      },
      select: {
        imageUrl: true,
        id: true,
        postImages: true
      }
    })
  }
  throw new Error('No primary image set')
}
