import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon
} from '@radix-ui/react-icons'
import { NavLink } from '@remix-run/react'

export default function ContactWidget() {
  const socails = [
    {
      name: 'GitHub',
      url: `www.github.com/Derick80`,
      icon: <GitHubLogoIcon />
    },
    {
      name: 'LinkedIn',
      url: `www.linkedin.com/in/dhoskinson`,
      icon: <LinkedInLogoIcon />
    },
    {
      name: 'X',
      url: `www.twitter.com/GeneticsStar`,
      icon: <TwitterLogoIcon />
    }
  ]
  return (
    <div className='flex w-full flex-row gap-2'>
      <div className='flex w-full flex-col gap-2'>
        <h6 className='text-left'>Contact me via Socials</h6>

        {socails.map((social) => (
          <NavLink
            key={social.name}
            to={social.url}
            className='prose flex w-full flex-row items-center gap-2 dark:prose-invert'
          >
            {social.icon}
            <h6>{social.name}</h6>
          </NavLink>
        ))}
      </div>
      <div className='flex w-full flex-col gap-2'>
        <h6 className='text-left'>Contact me via Email</h6>
        <div className='prose dark:prose-invert'>Email coming soon</div>
      </div>
    </div>
  )
}
