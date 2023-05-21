import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { getPosts } from '~/server/post.server'
import { useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import CommentContainer from '~/components/blog-ui/comments/comment-list'
import BlogCard from '~/components/gpt-blogcard'
import CommentBox from '~/components/blog-ui/comments/comment-box'
import React from 'react'


const options = [
  { id: '1', value: '1', label: '1' },
  { id: '2', value: '2', label: '2' },
  { id: '3', value: '3', label: '3' },
  { id: '4', value: '4', label: '4' },
  { id: '5', value: '5', label: '5' },
  { id: '6', value: '6', label: '6' },
  { id: '7', value: '7', label: '7' },
]
// export async function action({ request, params }: ActionArgs) {
//   const formData = await request.formData()
  

//   return json({ message: 'success' })
// }

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const posts = await getPosts()
  return json({ posts })
}

export default function BetaRoute() {
  const [open, setOpen] = React.useState(false)
  const data = useLoaderData<typeof loader>()
  // const test = data.posts.map((item)=>
  // item.comments)  
  // console.log(test, 'test')


  return(
 <>
    
{data.posts.map((post) => (
  <BlogCard key={post.id} post={post}/>
))}
    </>
  )
  
}


