import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import Button from '../button'
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { Form } from '@remix-run/react'

const socialProviders = [
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

          { socialProviders.map((item, index) => (
            <Form
              key={ index }
              name={ `social-login-form-${item.provider}` }
              className='' method='post' action={ `/${item.provider}` }>

              <Button
                type='submit'
                form={ `social-login-form-${item.provider}` }
                name='provider'
                value={ item.provider }
                variant='icon_unfilled'
              >
                { item.icon }
              </Button>
            </Form>
          )) }
        </div>
      </CardContent>
    </Card>
  )
}
