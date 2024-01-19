import type { LoaderFunctionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json } from '@remix-run/node'
import SelectBox from '~/components/select'
const options = [
  { id: '1', value: 'one', label: 'one' },
  { id: '2', value: 'two', label: 'two' },
  { id: '3', value: 'three', label: 'three' },
  { id: '4', value: 'four', label: 'four' },
  { id: '5', value: 'five', label: 'five' },
  { id: '6', value: 'six', label: 'six' },
  { id: '7', value: 'seven', label: 'seven' },
  { id: '8', value: 'eight', label: 'eight' },
  { id: '9', value: 'nine', label: 'nine' }
]

const picked = [
  { id: '1', value: 'one', label: 'one' },
  { id: '4', value: 'four', label: 'four' }
]

const singlePicked = [{ id: '1', value: 'one', label: 'one' }]
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return json({ message: 'not authorized' }, { status: 401 })
  }
  return json({ user })
}

export default function ComponentsIndex() {
  return (
    <div className='flex flex-col items-center justify-start gap-1'>
      <h1>UI Components</h1>
      <div className='flex flex-col items-center md:flex-row'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-start gap-2'></div>
        </div>
        <div className='flex flex-col items-start gap-2'>
          <p className='text-base font-semibold'>Single Select</p>
          <p className='text-sm font-bold'>
            Both components also contain a hidden input field making this usable
            within a form. This behaves a little weird because there are two
            instances of the select box where the portal targets the same DOM
            property. So, it'll anchor to the first select box
          </p>
          <SelectBox options={options} picked={singlePicked} />
          <p className='text-base font-semibold'>MultiSelect</p>
          <SelectBox options={options} picked={picked} multiple />
        </div>
      </div>
    </div>
  )
}
