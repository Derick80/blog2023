// app/routes/auth/$provider.tsx
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { authenticator } from '~/server/auth/auth.server'

export let loader = () => redirect('/login')


export let action = ({ request, params }: ActionFunctionArgs) => {
  const { provider } = zx.parseParams(params, {
    provider: z.string()

  })

  if (!provider) return redirect('/login')


  return authenticator.authenticate(provider, request)
}
