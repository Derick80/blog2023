import { Form, useActionData, useSearchParams } from '@remix-run/react'
import Button from '../button'
import { PasswordInput, TextInput } from '@mantine/core'

type Props = {
  authType: 'register' | 'login' | 'request' | 'confirm'
}

const actionMap: Record<Props['authType'], { button: string; url: string }> = {
  register: {
    url: '/register',
    button: 'Sign up'
  },
  login: {
    url: '/login',
    button: 'Log in'
  },
  request: {
    url: '/request-password-reset',
    button: 'Request password reset'
  },
  confirm: {
    url: '/confirm-password-reset',
    button: 'Confirm password'
  }
}

export const AuthForm = ({ authType }: Props) => {
  const action = useActionData()
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]

  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirectTo')

  return (
    <Form className='form-base rounded-xl' method='post' action={url}>
      <input type='hidden' name='redirectTo' value={redirectTo || '/'} />
      <input type='hidden' name='token' value={token || ''} />

      {authType !== 'confirm' && (
        <>
          <label className=''>Email</label>
          <TextInput
            placeholder='Email'
            name='email'
            description='Email must be valid'
            withAsterisk
          />
        </>
      )}
      {authType !== 'request' && (
        <>
          <label className=''>Username</label>
          <TextInput
            placeholder='Username'
            name='username'
            description='Username must be at least 3 characters long'
            withAsterisk
          />

          <label>Password</label>
          <PasswordInput
            name='password'
            placeholder='Password'
            description='Password must contain at least 8 characters'
            withAsterisk
            required
          />
        </>
      )}

      <div className='flex flex-col items-center gap-1'>
        <Button variant='primary_filled' type='submit'>
          {button}
        </Button>
      </div>
    </Form>
  )
}
