import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { cloudUpload } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'
import cloudinary from 'cloudinary'
// This is the ac tion that will be called when the form is submitted on the client from the image upload component that's likely in another route
export const action: ActionFunction = async ({ request }) => {
  // const imageUrl = await cloudUpload(request)
  // console.log('imageUrl', imageUrl)

  const imagegResults = (await cloudUpload(request.clone())) as {
    public_id: string
    secure_url: string
  }[]

  console.log('imagegResults', imagegResults)

  const imageData = imagegResults.map((image) => {
    return {
      imageUrl: image.secure_url,
      cloudinaryPublicId: image.public_id
    }
  })
  console.log(imageData, 'imageData')

  const formData = await request.clone().formData()

  const postId = formData.get('postId') as string
  console.log('postId', postId)

  const updated = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      postImages: {
        create: imageData.map((image) => {
          return {
            imageUrl: image.imageUrl,
            cloudinaryPublicId: image.cloudinaryPublicId
          }
        })
      }
    }
  })

  return json({ imagegResults })
}
