import { PostImage as prismaPostImage } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'

export type PostImage = SerializeFrom<prismaPostImage>
