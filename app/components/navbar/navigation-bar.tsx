import { NavLink } from '@remix-run/react'
import { ThemeToggle } from '../theme/theme-toggle'
import { BrandIcon } from '../brand-icon'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../ui/sheet'
import {
    BookmarkFilledIcon,
    CodeIcon,
    EnvelopeClosedIcon,
    FileTextIcon,
    HamburgerMenuIcon,
    HomeIcon,
    Pencil1Icon,
    PersonIcon
} from '@radix-ui/react-icons'

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
        name: 'Blog',
        href: '/blog',
        icon: <Pencil1Icon className=' w-4 h-4' />
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
            <MobileNavigationMenu />
        </>
    )
}

export default NavigationBar

const MobileNavigationMenu = () => {
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
                <ThemeToggle />

                <NavDrawer />
            </div>
        </nav>
    )
}

const DesktopNavigationMenu = () => {
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
                <DesktopNavigationMenu />
            </SheetContent>
        </Sheet>
    )
}
