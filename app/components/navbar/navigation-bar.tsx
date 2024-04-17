import {  NavLink } from '@remix-run/react'
import { ThemeToggle } from '../theme/theme-toggle'
import { BrandIcon } from '../brand-icon'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
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
    }

]



export const NavigationBar = () => {


    return (
        <
        >
<DesktopNavigationMenu />
<MobileNavigationMenu />
        </>
    )

}


export default NavigationBar

const MobileNavigationMenu = () => {
    return (
        <nav
        className='flex md:hidden justify-between items-center border-2 border-purple-400'
        >
            <BrandIcon />

            <NavDrawer />

        </nav>
    )
}

const DesktopNavigationMenu = () => {
    return (
        <div
        className='hidden md:flex items-center justify-between border-2 border-purple-500'
        >
            <BrandIcon />

            <ThemeToggle />

        </div>
    )
}

const NavDrawer = () => {

    return (
        <Sheet
        >
            <SheetTrigger>
                <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent
                side='right'
>
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}