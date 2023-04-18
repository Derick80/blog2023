import { ChatBubbleIcon, DrawingPinFilledIcon, HomeIcon, PersonIcon, ReaderIcon, RulerSquareIcon, TextIcon } from '@radix-ui/react-icons'
import { ColBox, RowBox } from './boxes'
import { Form, NavLink } from '@remix-run/react'
import Button from './button'
import { useOptionalUser } from '~/utilities'

export default function Layout({ children }: { children: React.ReactNode}){

    return(
        <div className='flex flex-col h-full'>
            <NavigationBar />
           <div className='flex flex-col h-full flex-grow p-2'>
           <LeftNavigationBar />
             <main>
                {children}
             </main>

                </div>


            </div>
    )
}

function NavigationBar(){
    const user = useOptionalUser()
    return(
        <div className='flex flex-row justify-around items-center w-full md:w-4/6 mx-auto h-16 p-1 md:p-2'>
            <h1 className='text-2xl font-bold'>Vanished</h1>
          <RowBox
            className='flex-wrap gap-2'
          >

                    <NavLink
                        className='flex flex-col items-center'
                    to='/'>
                        <HomeIcon />
                        <p className='text-sm'>Home</p>
                        </NavLink>
                <NavLink
                    className='flex flex-col items-center'
                    to='/blog'>
                    <ReaderIcon />
                    <p className='text-sm'>Blog</p>
                </NavLink>
                <NavLink
                    className='flex flex-col items-center'
                    to='/chats'>
                    <ChatBubbleIcon />
                    <p className='text-sm'>Chat</p>
                </NavLink>
                <NavLink
                    className='flex flex-col items-center'
                    to='/about'>
                    <PersonIcon />
                    <p className='text-sm'>About</p>
                </NavLink>
                <NavLink
                    className='flex flex-col items-center'
                    to='/projects'>
                    <RulerSquareIcon />
                    <p className='text-sm'>Projects</p>
                </NavLink>
          </RowBox>
            <RowBox>
                { user && (

            <Form className='base-form'
                method='POST' action='/logout'
            >

                <Button variant='danger_filled' size='base'>
                    Logout
                </Button>
            </Form>
                )}
            </RowBox>
            </div>
    )
}

function LeftNavigationBar(){
    return(
        <div className='flex flex-row md:flex-col w-full md:w-1/6 p-2 items-center justify-center gap-2'>

                <HomeIcon />
                <HomeIcon />
                <HomeIcon />



            </div>
    )
}
function RightNavigationBar(){
    return(
        <div className='flex flex-row md:flex-col w-full md:w-1/6 p-2 items-center justify-center gap-2'>            <ColBox>
                <HomeIcon />
                <HomeIcon />
                <HomeIcon />
            </ColBox>

            </div>
    )
}

function Main({children}: {children: React.ReactNode}){
    return(
        <div className='flex flex-col w-4/6  p-2'>
            {children}
            </div>
    )
}

function Footer(){
    return(
        <div className='flex flex-row items-center  h-16'>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
           <p
              className='text-xs mx-auto'>
                Copyright { new Date().getFullYear() }
              </p>
            </div>
    )
}