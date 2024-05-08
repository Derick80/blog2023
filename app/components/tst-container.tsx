import React from 'react'
import { Button } from './ui/button'

const TContainer = () => {
    const [count, setCount] = React.useState(0)

    function handleClick() {
        setCount((count) => count + 1)
    }
    return (
        <div className='flex w-full flex- items-center justify-center border-2 border-purple-500 text-red-500'>
            things here
            <Button onClick={handleClick}>Click me</Button>
            {count}
        </div>
    )
}

const Mybutton = () => {
    // const post = usePostContext()
    // console.log(post, 'post')
    const [count, setCount] = React.useState(0)
    return (
        <Button
            onClick={() => {
                setCount((count) => count + 1)
            }}
        >
            Click me
            {count}
        </Button>
    )
}

export { TContainer, Mybutton }
