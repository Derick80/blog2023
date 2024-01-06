import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'


export const socialProviders = [
  {
    provider: 'discord',
    icon: <DiscordLogoIcon width={ 20 } height={ 20 } />
  },
  {
    provider: 'github',
    icon: <GitHubLogoIcon width={ 20 } height={ 20 } />
  }
]
export const SocialLoginForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Login</CardTitle>
        <CardDescription>
          You can login using your social media account and there is no need to
          register a new email and password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3>Use any of these socials</h3>
        <div className='flex gap-3 justify-center'>


        </div>
      </CardContent>
    </Card>
  )
}
