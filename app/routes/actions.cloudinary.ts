import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { parseForm } from 'zodix'
import { deleteImage, setPrimaryImage } from '~/server/cloudinary.server'

const DeleteImageSchema = z.object({
  intent: z.literal('delete'),
  imageId: z.string(),
  imageUrl: z.string(),
  cloudinaryPublicId: z.string(),
  postId: z.string()
})

const SetPrimaryImageSchema = z.object({
  intent: z.literal('setPrimary'),
  imageUrl: z.string(),
  imageId: z.string(),
  isPrimary: z.string(),
  postId: z.string()
})

const PhotoFormSchema = z.discriminatedUnion('intent', [
  DeleteImageSchema,
  SetPrimaryImageSchema
])

export type ActionInput = z.infer<typeof PhotoFormSchema>
export async function action({ request }: ActionFunctionArgs) {
  const data = await parseForm(request, PhotoFormSchema)
  console.log(data, 'data from cloudinary delete and primary')

  switch (data.intent) {
    case 'delete':
      return json(
        await deleteImage({
          cloudinaryPublicId: data.cloudinaryPublicId,
          imageId: data.imageId,
          imageUrl: data.imageUrl,
          postId: data.postId
        })
      )

    case 'setPrimary': {
      return json(
        await setPrimaryImage({
          postId: data.postId,
          imageId: data.imageId,
          imageUrl: data.imageUrl
        })
      )
    }
    default:
      return json({ message: 'Image uploaded' })
  }
}
