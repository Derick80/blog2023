// app/routes/auth/$provider.callback.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { zx } from 'zodix'
import { authenticator } from '~/server/auth/auth.server'

export let loader = ({ request, params }: LoaderFunctionArgs) => {
  const { provider } = zx.parseParams(params, {
    provider: z.string()
  })

  return authenticator.authenticate(provider, request, {
    successRedirect: '/',
    failureRedirect: '/login'
  })
}
