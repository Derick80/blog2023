import { DiscordLogoIcon } from '@radix-ui/react-icons'
import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import Button from '~/components/button'
import { authenticator, isAuthenticated } from '~/server/auth/auth.server'

export async function loader(args: LoaderFunctionArgs) {
  return (await isAuthenticated(args.request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate('login', request, {
      successRedirect: '/'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof Error)
      return json({
        message: error.message
      })
  }
}
export default function Login() {
  return (
    <div className='flex w-full flex-col text-violet12 dark:text-violet12_dark'>
      <AuthForm authType='login' />
      <div className='mb-2 mt-2 flex h-full flex-col items-center justify-center md:mb-5 md:mt-5'>
        <h6>OR</h6>
        <p className='text-sm italic'>Login with your social account</p>
      </div>
      <div className='flex items-center justify-center'>
        <SocialLoginForm provider='discord'>
          <Button variant='icon_unfilled' size='small'>
            <DiscordLogoIcon />
          </Button>
        </SocialLoginForm>
      </div>

      <div className='mb-2 mt-2 flex flex-col items-center justify-center md:mb-5 md:mt-5'>
        <h6>OR</h6>

        <Link to='/register'>
          <p className='text-sm italic'>Register a new account</p>
        </Link>
      </div>
    </div>
  )
}
