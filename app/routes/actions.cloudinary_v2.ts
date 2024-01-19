import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import { cloudUpload, deleteImage } from '~/server/cloudinary.server'
import { prisma } from '~/server/prisma.server'
import { validateAction } from '~/utilities'

export async function action({ request, params }: ActionFunctionArgs) {
  const imagegResults = await cloudUpload(request)

  if (!imagegResults) {
    throw new Error('Error uploading image')
  }

  console.log('imagegResults', imagegResults)
  return json({ imagegResults })
}
