import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from '../ui/navigation-menu'
import NavLinks from './nav-links'

const DesktopMenu = () => {
  return (
    <NavigationMenu className='hidden md:flex justify-between'>
      <NavigationMenuList>
        {menuItems.map((item, index) => {
          return (
            <NavigationMenuItem className='' key={index}>
              <NavLinks
                path={item.path}
                label={item.label}
                title={item.title}
              />
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default DesktopMenu

export const menuItems = [
  {
    label: 'Home',
    title: 'Click to go to the home page',
    path: '/'
  },
  {
    label: 'Blog',
    title: 'View the blog posts',
    path: '/blog'
  },
  {
    label: 'About',
    title: 'Learn more about me',
    path: '/about'
  },
  {
    label: 'Projects',
    title: 'View the projects',
    path: '/projects'
  },
  {
    label: 'CV',
    title: 'View my CV',
    path: '/cv'
  },

  {
    label: 'Users',
    title: 'View the users',
    path: '/users'
  }
]
