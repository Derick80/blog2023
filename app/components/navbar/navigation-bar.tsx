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
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

const navigationLinks = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'About',
        href: '/about'
    },
    {
        name: 'Blog',
        href: '/blog'
    },
    {
        name: 'Projects',
        href: '/projects'
    },
    {
        name: 'Contact',
        href: '/contact'
    },
    {
        name: 'Writing',
        href: '/writing'
    }
]

export const NavigationBar = () => {
    return (
        <>
            <DesktopNavigationMenu />
            <MobileNavigationMenu />
        </>
    )
}

export default NavigationBar

const MobileNavigationMenu = () => {
    return (
        <nav className='flex md:hidden justify-between items-center p-1 border-2 border-purple-400'>
            <BrandIcon />
            <NavLink
                className='text-purple-500 hover:text-purple-700'
                to='/blog'
            >
                Blog
            </NavLink>
            {
                navigationLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        className='text-purple-500 hover:text-purple-700'
                        to={link.href}
                    >
                        {link.name}
                    </NavLink>
                ))
            }
            <NavDrawer />
        </nav>
    )
}

const DesktopNavigationMenu = () => {
    return (
        <div className='hidden md:flex items-center justify-between p-2 border-2 border-purple-500'>
            <BrandIcon />
            <NavLink
                className='text-purple-500 hover:text-purple-700'
                to='/blog'
            >
                Blog
            </NavLink>
            {
                navigationLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        className='text-purple-500 hover:text-purple-700'
                        to={link.href}
                    >
                        {link.name}
                    </NavLink>
                ))
            }
        </div>
    )
}

const NavDrawer = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent side='right'>
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
