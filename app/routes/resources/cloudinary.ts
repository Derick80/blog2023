import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { cloudUpload } from '~/server/auth/cloudinary.server'

// This is the ac tion that will be called when the form is submitted on the client from the image upload component that's likely in another route
export const action: ActionFunction = async ({ request }) => {
  const imageUrl = await cloudUpload(request)

  return json({ imageUrl })
}
