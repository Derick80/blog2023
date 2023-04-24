import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import React from "react"


export type MenuBoxProps = {
    title: string
    children: React.ReactNode
}
export default function MenuBox({ title, children }: MenuBoxProps) {
    const [menu, setMenu] = React.useState(false)
    return (
      <div className='relative flex w-full flex-col'>
        <div className='flex w-full items-center justify-between'>
          <h6 className='text-sm font-bold'>{title}</h6>
          <div className='flex items-center'>
            <button onClick={() => setMenu(!menu)}>
             {menu ? <ChevronUpIcon 
              className='text-teal-400'
              /> : <ChevronDownIcon
              className='text-teal-400'
  
              />}
            </button>
          </div>
        </div>
        {menu && (
          <div className='flex w-full flex-col border-2'>
            <div className='flex flex-col w-full items-center justify-between'>
              <h6 className='text-sm font-bold'>Menu</h6>
              <div className='flex items-center'>things here</div>
              <div className='flex items-center'>things here</div>
              <div className='flex items-center'>things here</div>
              <div className='flex items-center'>things here</div>
            </div>
          </div>
        )}
      </div>
    )
  }