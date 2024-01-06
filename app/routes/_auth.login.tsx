import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { AuthForm } from '~/components/auth/auth-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import Button from '~/components/button'

import { authenticator } from '~/server/auth/auth.server'
import { socialProviders } from '~/components/auth/social-login-form'

export async function action ({ request }: ActionFunctionArgs) {
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
    <div className='grid gap-5 items-center max-w-lg mx-auto'>
      <AuthForm authType='login' />

      <h3 className='text-center'>Or</h3>
      <Card
        className='flex flex-col gap-3 items-center justify-center'
      >
        <CardHeader>
          <CardTitle
            className='text-center'
          >Social Media Login</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  )
}
