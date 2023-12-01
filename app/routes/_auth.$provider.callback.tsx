// app/routes/auth/$provider.callback.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/server/auth/auth.server'

export let loader = ({ request, params }: LoaderFunctionArgs) => {
  const provider = params.provider as string
  return authenticator.authenticate(provider, request, {
    successRedirect: '/',
    failureRedirect: '/login'
  })
}
