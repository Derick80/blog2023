import { Form, useActionData, useSearchParams } from '@remix-run/react'
import Button from '../button'

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
          <input placeholder='Email' name='email' type='email' required />
        </>
      )}
      {authType !== 'request' && (
        <>
          <label className=''>Username</label>
          <input placeholder='Username' name='username' />

          <label>Password</label>
          <input
            type='password'
            name='password'
            placeholder='Password'
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
