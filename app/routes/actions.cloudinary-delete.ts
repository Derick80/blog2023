import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { deleteImage } from '~/server/cloudinary.server'
import { validateAction } from '~/utilities'

const schema = z.object({
  imageId: z.string(),
  publicId: z.string()
})

type ActionInput = z.infer<typeof schema>
export async function action({ request }: ActionFunctionArgs) {
  const { formData, errors } = await validateAction({
    request,
    schema
  })
  if (errors) {
    return errors
  }
  const { imageId, publicId } = formData as ActionInput

  const deleted = await deleteImage({
    pId: publicId,
    imageId
  })
  if (deleted) {
    return json({ message: 'Image deleted successfully' })
  }
  return json({ message: 'Error deleting image' })
}
