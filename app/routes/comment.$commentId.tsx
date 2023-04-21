import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import { zx } from 'zodix'
import { prisma } from '~/server/auth/prisma.server'
import { z } from 'zod'

export async function loader({ request, params }: LoaderArgs) {
  const { commentId } = zx.parseParams(params, { commentId: z.string() })

  const comments = await prisma.comment.findMany({
    where: {
      parentId: commentId
    },

    include: {
      user: true
    }
  })

  return json({ comments })
}

// export default function Index() {
//   const data = useLoaderData()
//   return (
//     <div className=''>
//       <h1 className='text-4xl font-semibold'>Comment</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   )
// }
