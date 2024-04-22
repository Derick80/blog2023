import { NavLink } from '@remix-run/react'
import { ThemeToggle } from '../theme/theme-toggle'
import { BrandIcon } from '../brand-icon'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import {
    BookmarkFilledIcon,
    CodeIcon,
    EnterIcon,
    EnvelopeClosedIcon,
    ExitIcon,
    FileTextIcon,
    HamburgerMenuIcon,
    HomeIcon,
    PersonIcon
} from '@radix-ui/react-icons'
import { useRootLoaderData } from '~/root'

const navigationLinks = [
    {
        name: 'Home',
        href: '/',
        icon: <HomeIcon className=' w-4 h-4' />
    },
    {
        name: 'About',
        href: '/about',
        icon: <PersonIcon className=' w-4 h-4' />
    },

    {
        name: 'Projects',
        href: '/projects',
        icon: <CodeIcon className=' w-4 h-4' />
    },
    {
        name: 'Contact',
        href: '/contact',
        icon: <EnvelopeClosedIcon className=' w-4 h-4' />
    },
    {
        name: 'CV',
        href: '/cv',
        icon: <FileTextIcon className=' w-4 h-4' />
    },
    {
        name: 'Writing',
        href: '/writing',
        icon: <BookmarkFilledIcon className=' w-4 h-4' />
    }
]

export const NavigationBar = () => {
    return (
        <>
            <MainNavigationMenu />
        </>
    )
}

export default NavigationBar

const MainNavigationMenu = () => {
    const data = useRootLoaderData()
    const user = data?.user

    return (
        <nav className='flex justify-between items-center p-1'>
            <BrandIcon />

            {navigationLinks.map((link) => (
                <NavLink
                    key={link.href}
                    className={({ isActive }) =>
                        isActive
                            ? 'underline flex items-center gap-2'
                            : 'flex items-center gap-2 '
                    }
                    to={link.href}
                    title={link.name}
                >
                    {link.icon}

                    <div className='text-base hidden md:block'>{link.name}</div>
                </NavLink>
            ))}
            <div className='flex items-center justify-between '>
                {user ? (
                    <NavLink
                        className='flex flex-row items-center gap-2'
                        to='/logout'
                    >
                        <ExitIcon />
                        <div className='text-base hidden md:block'>
                            Logout
                        </div>{' '}
                    </NavLink>
                ) : (
                    <NavLink
                        className='flex flex-row items-center gap-2'
                        to='/login'
                    >
                        <EnterIcon />
                        <div className='text-base hidden md:block'>Login</div>
                    </NavLink>
                )}
                <ThemeToggle />

                <NavDrawer />
            </div>
        </nav>
    )
}

// Mobile Navigation Menu for use in the NavDrawer component

const MobileNavigationMenu = () => {
    const data = useRootLoaderData()
    const user = data?.user
    return (
        <div className='flex flex-col justify-around '>
            <NavLink className='flex flex-row items-center' to='/blog'>
                <BrandIcon />
                Home
            </NavLink>
            {navigationLinks.map((link) => (
                <NavLink
                    key={link.href}
                    prefetch='intent'
                    className=''
                    to={link.href}
                >
                    {link.name}
                </NavLink>
            ))}
            {user ? (
                <NavLink
                    className='flex flex-row items-center gap-2'
                    to='/logout'
                >
                    <ExitIcon />
                    <div className='text-base '>Logout</div>{' '}
                </NavLink>
            ) : (
                <NavLink to='/login'>
                    <EnterIcon />
                    <div className='text-base '>Login</div>
                </NavLink>
            )}
            <ThemeToggle />
        </div>
    )
}

const NavDrawer = () => {
    return (
        <Sheet>
            <SheetTrigger className='block md:hidden'>
                <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent side='right'>
                <MobileNavigationMenu />
            </SheetContent>
        </Sheet>
    )
}
