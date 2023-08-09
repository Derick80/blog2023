import { Form, useSearchParams } from '@remix-run/react'
import Button from '../v3-components/button'

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
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]

  const token = searchParams.get('token')
  const redirectTo = searchParams.get('redirectTo')

  return (
    <Form className='flex flex-col gap-2' method='post' action={url}>
      <input type='hidden' name='redirectTo' value={redirectTo || '/'} />
      <input type='hidden' name='token' value={token || ''} />

      {authType !== 'confirm' && (
        <>
          <label className=''>Email</label>
          <input placeholder='enter email' name='email' type='email' required />
        </>
      )}
      {authType !== 'request' && (
        <>
          <label className=''>Username</label>
          <input type='text' placeholder='enter username' name='username' />

          <label>Password</label>
          <input
            type='password'
            name='password'
            placeholder='enter password'
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
