import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { AuthForm } from '~/components/auth/auth-form'

import Button from '~/components/button'

import { authenticator } from '~/server/auth/auth.server'
import { socialProviders } from '~/components/auth/social-login-form'

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
      { socialProviders.map((item, index) => (
        <Form
          key={ index }

          action={ `/${item.provider}` }
          className='' method='POST' >

          <Button

            value={ item.provider }
            variant='ghost'
          >
            { item.icon }
          </Button>
        </Form>
      )) }
    </div>
  )
}
