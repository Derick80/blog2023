import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import React from 'react'
import { Form } from '@remix-run/react'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { RowBox } from '~/components/boxes'
import { Portal } from '~/components/portal'
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

function Picker({
  options,
  picked
}: {
  options: { id: string; value: string; label: string }[]
  picked: { id: string; value: string; label: string }[]
}) {
  const [selected, setSelected] = React.useState(picked)

  const handleSelect = (id: string) => {
    const isSelected = selected.some((item) => item.id === id)
    if (isSelected) {
      setSelected(selected.filter((item) => item.id !== id))
    } else {
      const item = options.find((item) => item.id === id)
      if (item) {
        setSelected([...selected, item])
      }
    }
  }

  const [dropdown, setDropdown] = React.useState(false)
  return (
      <div className='flex w-full flex-col'
      id='picker'
      >
        <RowBox className='w-full'>
          <div 
          //  id='picker'
          className='flex w-full  flex-row gap-2 rounded-md border-2 border-gray-200 p-3 dark:bg-slate-800'>
            {selected.map((item) => (
              <div
              //  id='picker'
                className='flex justify-start rounded-md border bg-gray-200 p-2 dark:text-slate-50 dark:bg-slate-800'
                key={item.id}
              >
                <button onClick={() => handleSelect(item.id)}>
                  {item.label}
                </button>
              </div>
            ))}
      
              <div className='flex flex-grow' />
              <button onClick={() => setDropdown(!dropdown)}>
                {dropdown ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            
          </div>
        
        </RowBox>
     <div>
     <Portal wrapperId='picker'>
        {dropdown && (
          <div className='relative flex flex-col mt-5 bottom-36 gap-1 bg-gray-200  dark:bg-slate-800 h-fit z-30 rounded-md items-center'>
            {options.map((item) => (
            
                <button 
                className='flex w-full justify-start rounded-md bg-gray-200 dark:bg-slate-800 p-2 hover:border-slate-700'
                  key={item.id}
                  onClick={() => handleSelect(item.id)}>
                  {item.label}
                </button>
         
            ))}
          </div>
        )

            }
         </Portal>
     </div>
  <input
          type='hidden'
          name='selection'
          value={selected.map((item) => item.id)}
        />
        
      </div>
  )
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
    id='picker'
        className=''>
      <Form method='post'
        className='flex flex-col gap-2 w-full flex-1'
      >
<Picker options={options} picked={picked}/>

     
   <label
//  id='picker'
    htmlFor='selection'>Selection</label>
        <input type='text' name='title' id='title' />
        <button type='submit'>Submit</button>
      </Form>
    </div>
  )
}
