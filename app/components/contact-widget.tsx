import {
    GitHubLogoIcon,
    LinkedInLogoIcon,
    TwitterLogoIcon
} from '@radix-ui/react-icons'
import { Link } from '@remix-run/react'
import { H2, H3 } from './ui/typography'

export default function ContactWidget() {
    const socails = [
        {
            name: 'GitHub',
            url: `https://www.github.com/Derick80`,
            icon: <GitHubLogoIcon />
        },
        {
            name: 'LinkedIn',
            url: `https://www.linkedin.com/in/dhoskinson`,
            icon: <LinkedInLogoIcon />
        },
        {
            name: 'X',
            url: `https://www.twitter.com/GeneticsStar`,
            icon: <TwitterLogoIcon />
        }
    ]
    return (
        <div className='flex w-full flex-col gap-2 border-2 border-yellow-500'>
            <H2>
                Connect with Me
            </H2>
            <div className='flex w-full flex-col gap-2'>
                <H3>via Socials</H3>

                {socails.map((social) => (
                    <Link
                        key={social.name}
                        to={social.url}
                        rel='noopener noreferrer'
                        target='_blank'
                        className='prose flex w-full flex-row items-center gap-2 dark:prose-invert'
                    >
                        {social.icon}
                     {social.name}
                    </Link>
                ))}
            </div>
            <div className='flex w-full flex-col gap-2'>
                <H3 >via Email</H3>
                <div className='prose dark:prose-invert'>coming soon</div>
            </div>
        </div>
    )
}
