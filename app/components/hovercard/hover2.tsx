import React from 'react'
import { useFetcher } from '@remix-run/react'


export default function HoverOCard() {
    const userFetcher = useFetcher()

  React.useEffect(() => {
    if (userFetcher.state === 'idle' && userFetcher.data === undefined) {
      userFetcher.load('/account')
    }
  }, [userFetcher])

  console.log(userFetcher.data, 'userFetcher.data')
    const [hovered, setHovered] = React.useState(true)
  return (
    <div 
    className='flex flex-col items-center justify-center'
    >
    <button className='btn' onMouseEnter={() => setHovered(true)} >
       <img src={userFetcher.data?.user?.avatarUrl} alt={userFetcher.data?.user?.username} className='h-8 w-8 rounded-full' />
    </button>
    {hovered && (
        <>
        {
            userFetcher.data && (
                <div className='container'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. At odit, vero
        iure cumque eligendi nam eos ullam nobis, sed porro delectus officia quam
        quae! Cumque inventore laudantium velit illo facilis!
      </div>
            )
        }
        </>
    )}
    
    </div>
  )
}
