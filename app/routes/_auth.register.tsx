import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { AuthorizationError } from 'remix-auth'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import { authenticator } from '~/server/auth/auth.server'

export async function action({ request }: LoaderFunctionArgs) {
  try {
    return await authenticator.authenticate('register', request, {
      successRedirect: '/blog'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof AuthorizationError)
      return json({
        message: error.message
      })
  }
}

export default function Page() {
  return (
    <div>
      <AuthForm authType='register' />
      <SocialLoginForm>
        <div className='mt-4'>
          <Link to='/login'>Already have an Account?</Link>
        </div>
      </SocialLoginForm>
    </div>
  )
}
