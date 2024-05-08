import { Link, NavLink } from '@remix-run/react'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { useRootLoaderData } from '~/root'
import { Muted } from '../ui/typography'

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
                <div className=' md:block' key={link.href}>
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? 'underline flex items-center gap-2'
                                : 'flex items-center gap-2 '
                        }
                        to={link.href}
                        title={link.name}
                    >
                        {link.icon}

                        <div className='text-base hidden md:block'>
                            {link.name}
                        </div>
                    </NavLink>
                </div>
            ))}
            <div className='flex items-center justify-between '>
                {user ? (
                    <div className='hidden md:block'>
                        <AccountDropdown />
                    </div>
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
                    className='flex flex-row items-center gap-2'
                    to={link.href}
                >
                    {link.icon}

                    <div className='text-base '>{link.name}</div>
                </NavLink>
            ))}
            {user ? (
                <AccountDropdown />
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
            <SheetTrigger
                aria-label='mobileMenu'

                className='block md:hidden'>
                <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent side='right'>
                <MobileNavigationMenu />
            </SheetContent>
        </Sheet>
    )
}

const AccountDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row items-center gap-2'>
                <PersonIcon />
                <div className='text-base'>Account</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Link to='/account'>Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <NavLink
                        className='flex flex-row items-center gap-2'
                        to='/logout'
                    >
                        <ExitIcon />
                        <div className='text-base '>Logout</div>{' '}
                    </NavLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
