import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import VerticalMenu from '~/components/vertical-menu'


export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  console.log(data, 'data')

  return json({ data })
}

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return json({ user })
}

export default function BetaRoute() {
  return (
    <div
    className=''>
     <VerticalMenu >
<div>1</div>
<div>1</div>
<div>1</div>
<div>1</div>
     </VerticalMenu>
     <div className='statsic flex flex-col gap-2'>
     <div>2</div>
     <div>2</div>
     <div>2</div>
     <div>2</div>
     </div>
    </div>
  )
}
