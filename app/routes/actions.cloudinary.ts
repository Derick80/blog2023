import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { cloudUpload } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'
import cloudinary from 'cloudinary'
// This is the ac tion that will be called when the form is submitted on the client from the image upload component that's likely in another route
export const action: ActionFunction = async ({ request }) => {
  // const imageUrl = await cloudUpload(request)
  // console.log('imageUrl', imageUrl)

  const imagegResults = await cloudUpload(request)

  console.log('imagegResults', imagegResults)

  const formData = await request.clone().formData()
  console.log(Object.fromEntries(formData.entries()))

  const postId = formData.get('postId') as string
  console.log('postId', postId)

  const updated = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      postImages: {
        create: imagegResults.map((image) => {
          return {
            imageUrl: image.secure_url,
            cloudinaryPublicId: image.public_id,
            filename: image.original_filename
          }
        })
      }
    }
  })

  return json({ imagegResults })
}
