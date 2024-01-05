import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import Button from '~/components/button'

import { Separator } from '~/components/ui/separator'
import { authenticator, isAuthenticated } from '~/server/auth/auth.server'

export async function loader (args: LoaderFunctionArgs) {
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
export default function Login () {
  return (
    <div className='grid gap-5 items-center'>
      <AuthForm authType='login' />

      <h3 className='text-center'>Or</h3>
      <SocialLoginForm />
    </div>
  )
}
