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
        return cn`text-xl font-bold ${isActive ? 'underline' : ''} ${className}`
      }}
    >
      <span className='text-xl font-bold'>{label}</span>
    </NavLink>
  )
}

export default NavLinks
