import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { AuthForm } from '~/components/auth/auth-form'

import { authenticator } from '~/server/auth/auth.server'

import { validateAction } from '~/utilities'
import { z } from 'zod'


export const AuthSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('login'),
    email: z.string().email('Email should be a valid email'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter'
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number'
      )
      .refine(
        (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        'Password must contain at least one symbol'
      )
  }),
  z.object({
    intent: z.literal('register'),
    email: z.string().email('Email should be a valid email'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter'
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number'
      )
      .refine(
        (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        'Password must contain at least one symbol'
      )
  })
])

export type ActionInput = z.infer<typeof AuthSchema>

export async function action ({ request }: ActionFunctionArgs) {
  // Clone the request so we can read the body twice
  const requested = await request.clone()
  const { formData, errors } = await validateAction({
    request: requested,
    schema: AuthSchema
  })
  if (errors) {
    return json(
      {
        errors
      },
      {
        status: 400
      }
    )
  }

  const { intent } = formData as ActionInput

  switch (intent) {
    case 'login':
      return await authenticator.authenticate('login', request, {
        successRedirect: '/',
        context: { formData }
      })
    case 'register':
      return await authenticator.authenticate('register', request, {
        successRedirect: '/',
        context: { formData }
      })
  }
}
export default function Login () {
  return (
    <div className='grid gap-5 items-center max-w-lg mx-auto'>
      <AuthForm />
    </div>
  )
}
