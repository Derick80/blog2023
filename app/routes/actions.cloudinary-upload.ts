import { type ActionFunctionArgs, json } from '@remix-run/node'
import { cloudUpload } from '~/server/cloudinary.server'

export async function action({ request, params }: ActionFunctionArgs) {
  const imageResults = await cloudUpload(request)
  return json({ imageResults })
}
