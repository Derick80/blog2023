import { NavLink } from '@remix-run/react'
import { cn } from '~/lib/utils'

const NavLinks = ({
  path,
  label,
  title,
  className
}: {
  path: string
  label: string
  title: string
  className?: string
}) => {
  return (
    <NavLink
      to={path}
      title={title}
      className={({ isActive, isPending }) => {
        return cn`font-semibold ${isActive ? 'underline' : ''} ${className}`
      }}
    >
      <span className='font-semibold'>{label}</span>
    </NavLink>
  )
}

export default NavLinks
