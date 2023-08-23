import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { getPostsVersionTwo } from '~/server/post.server'
import { Form, Link, NavLink } from '@remix-run/react'
import type { User } from '~/server/schemas/schemas'
import { post } from '~/resources/fake-singlepost'
import {
  OpenInNewWindowIcon,
  ChatBubbleIcon,
  ExitIcon
} from '@radix-ui/react-icons'
import LikeContainer from '~/components/v3-components/blog-ui/like-container-v2'
import type {
  FullPost,
  Category_v2,
  Like_v2,
  Favorite_v2
} from '~/server/schemas/schemas_v2'
import clsx from 'clsx'
import { ShareButton } from '~/components/v3-components/share-button_v2'
import { formatDateAgo } from '~/utilities'
import * as HoverCard from '@radix-ui/react-hover-card'
import Button from '~/components/v3-components/button_v2'
import FavoriteContainer from '~/components/favorite-container_v2'

// export async function action({ request, params }: ActionArgs) {
//   const formData = await request.formData()

//   return json({ message: 'success' })
// }

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPostsVersionTwo()

  // const posts = await getInitialPosts()
  return json({ posts })
}
