import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import Picker from '~/components/picker'
import PickerVers from '~/components/picker-vers'
const options = [
  { id: '1', value: 'one', label: 'one' },
  { id: '2', value: 'two', label: 'two' },
  { id: '3', value: 'three', label: 'three' },
  { id: '4', value: 'four', label: 'four' }
]

const picked = [
  { id: '1', value: 'one', label: 'one' },
  { id: '4', value: 'four', label: 'four' }
]

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
    <div className=''>
      <Form method='post' className='flex w-full flex-1 flex-col gap-2'>
        <h1 className='text-2xl'>Beta</h1>
        <p>
          This is a beta route. It's only accessible to logged in users. It
          demonstrates how to use the <code>loader</code> function to redirect
          users to the login page if they're not logged in.
        </p>
               <label
          //  id='picker'
          htmlFor='selection'
        >
          Selection
        </label>
        <Picker options={options} picked={picked} />

<label htmlFor='selection'>Single Selection</label>
     <PickerVers options={options} picked={picked}  />
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' id='title' />

        <button type='submit'>Submit</button>
      </Form>
    </div>
  )
}
