import { Form, useActionData } from '@remix-run/react'

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
import type { ActionInput } from '~/routes/_auth.login'
import React from 'react'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { Separator } from '../ui/separator'
import { Muted } from '../ui/typography'
import { Button } from '../ui/button'

export const socialProviders = [
  {
    provider: 'discord',
    label: 'Login with Discord',
    icon: <DiscordLogoIcon width={20} height={20} />
  }
  // {
  //   provider: 'github',
  //   label: 'Login with Github',
  //   icon: <GitHubLogoIcon width={ 20 } height={ 20 } />
  // },
]
type Props = {
  mode: 'register' | 'login' | 'request' | 'confirm' | 'OTP'
}

const actionMap: Record<
  Props['mode'],
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
  },
  OTP: {
    url: '/totp',
    button: 'Email me a OTP',
    emailCaption:
      'Enter your email address and we will send you a link to reset your password.',
    socialsCaption:
      'You can login using your social media account and there is no need to register a new email and password.'
  }
}

export const AuthForm = () => {
  const actionData = useActionData<{
    errors: {
      email: string
      password: string
      username?: string
    }
  }>()

  const [mode, setMode] = React.useState<'login' | 'register' | 'OTP'>('login')
  const { button, url } = actionMap[mode]

  const generalMemberLoginInstructions =
    'Login to your account using your email and password.'
  const notAMemberRegisterInstructions =
    'Register a new account using your email and password.'

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-center'>Welcome back</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? generalMemberLoginInstructions
            : mode === 'register'
              ? notAMemberRegisterInstructions
              : 'Register or Login by sending me an OTP code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method='POST' className='grid gap-3' action={url}>
          <Label htmlFor='email'>Email address</Label>
          <Input
            type='email'
            name='email'
            id='email'
            placeholder='Email'
            autoComplete='email'
            required
          />
          {actionData?.errors?.email && (
            <p id='title-error' className='text-red-500'>
              {actionData?.errors?.email}
            </p>
          )}

          {mode === 'register'  || mode === 'OTP'  && (
            <>
              <Label className='sr-only' htmlFor='username'>
                Username
              </Label>
              <Input
                type='text'
                name='username'
                id='username'
                placeholder='Username'
                autoComplete='username'
                required
              />
              {actionData?.errors?.username && (
                <p id='title-error' className='text-red-500'>
                  {actionData?.errors?.username}
                </p>
              )}
            </>
          )}

          {mode !== 'OTP' && (
            <>
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
              {actionData?.errors?.password && (
                <p id='title-error' className='text-red-500'>
                  {actionData?.errors?.password}
                </p>
              )}
            </>
          )}

          <Button
            className='w-full justify-center'
            variant='default'
            name='intent'
            value={mode}
            type='submit'
          >
            {button}
          </Button>
        </Form>
      </CardContent>
      <CardContent>
        <Separator />
        <Muted className='text-center text-base pt-2'>or</Muted>
      </CardContent>
      <CardContent className='items-center justify-center gap-2'>
        {socialProviders.map((item, index) => (
          <Form
            key={index}
            name={`social-login-${item.provider}`}
            action={`/${item.provider}`}
            className='flex flex-col items-center gap-2'
            method='POST'
          >
            <Button
              className='w-full text-center justify-center gap-2'
              // form={ `social-login-${item.provider}` }
              value={item.provider}
              variant='ghost'
              size='icon'
            >
              {item.icon}

              <p>{item.label} </p>
            </Button>
          </Form>
        ))}
      </CardContent>
      <CardFooter className='flex flex-row items-center mx-auto gap-2'>
        <Button
          type='button'
          className='w-full justify-center'
          variant='ghost'
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          <Muted className='text-base'>
            {mode === 'login'
              ? 'Not a member? Register'
              : 'Already a member? Login'}
          </Muted>
        </Button>

        <Button
          type='button'
          className='w-full justify-center'
          variant='ghost'
          onClick={() => setMode(mode === 'OTP' ? 'login' : 'OTP')}
        >
          <Muted className='text-base'>
            {mode === 'OTP'
              ? 'Login using password'
              : 'Login or Register using OTP code'}
          </Muted>
        </Button>
      </CardFooter>
    </Card>
  )
}
