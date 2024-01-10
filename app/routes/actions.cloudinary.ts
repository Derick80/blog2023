import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { cloudUpload } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'

// This is the ac tion that will be called when the form is submitted on the client from the image upload component that's likely in another route
export const action: ActionFunction = async ({ request }) => {
  // const imageUrl = await cloudUpload(request)
  // console.log('imageUrl', imageUrl)

  const images = await cloudUpload(request.clone())

  console.log(images, 'images')

  const imageArray = images
  console.log('imageArray', imageArray)

  const formData = await request.clone().formData()

  const postId = formData.get('postId') as string
  console.log('postId', postId)

  const updated = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      postImages: {
        create: imageArray.map((image) => {
          return {
            imageUrl: image,
            cloudinaryPublicId: getPublicId(image)
          }
        })
      }
    }
  })

  return json({ images })
}

export function getPublicId(url: string) {
  // get the public id from the url of the image on cloudinary which is the last part of the url before the file extension
  const urlSplit = url.split('/')
  const publicId = urlSplit[urlSplit.length - 1].split('.')[0]
  return publicId
}
