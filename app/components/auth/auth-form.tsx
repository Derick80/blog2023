import { Form, Link } from '@remix-run/react'
import Button from '../button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
type Props = {
  authType: 'register' | 'login' | 'request' | 'confirm'
}

const actionMap: Record<
  Props['authType'],
  { button: string; url: string; emailCaption: string; socialsCaption: string }
> = {
  register: {
    url: '/register',
    button: 'Sign up',
    emailCaption: 'Register a new account using your email and password.',
    socialsCaption:
      'You can register using your social media account and there is no need to provide a new password.'
  },
  login: {
    url: '/login',
    button: 'Log in',
    emailCaption: 'Login to your account using your email and password.',
    socialsCaption:
      'You can login using your social media account and there is no need to register a new email and password.'
  },
  request: {
    url: '/request-password-reset',
    button: 'Request password reset',
    emailCaption:
      'Enter your email address and we will send you a link to reset your password.',
    socialsCaption:
      'You can login using your social media account and there is no need to register a new email and password.'
  },
  confirm: {
    url: '/confirm-password-reset',
    button: 'Confirm password',
    emailCaption:
      'Enter your email address and we will send you a link to reset your password.',
    socialsCaption:
      'You can login using your social media account and there is no need to register a new email and password.'
  }
}

export const AuthForm = ({ authType }: Props) => {
  const { button, url } = actionMap[authType]

  const generalMemberLoginInstructions =
    'Login to your account using your email and password.'
  const notAMemberRegisterInstructions =
    'Register a new account using your email and password.'

  return (
    <Card className=''>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          {authType === 'login'
            ? generalMemberLoginInstructions
            : notAMemberRegisterInstructions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method='POST' className='grid gap-3' action={url}>
          <Label className='sr-only' htmlFor='email'>
            Email
          </Label>
          <Input
            type='email'
            name='email'
            id='email'
            placeholder='Email'
            autoComplete='email'
            required
          />
          <Label className='sr-only' htmlFor='password'>
            Password
          </Label>
          <Input
            type='password'
            name='password'
            id='password'
            placeholder='Password'
            autoComplete='current-password'
            required
          />

          <Button variant='primary_filled' type='submit'>
            {button}
          </Button>
        </Form>
      </CardContent>
      <CardContent></CardContent>
      <CardFooter>
        <Link to='/register'>
          <p className='text-sm italic'>{}</p>
        </Link>
      </CardFooter>
    </Card>
  )
}
