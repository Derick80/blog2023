import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'

import bcrypt from 'bcryptjs'
import { getUser, createUser, getUserPasswordHash } from '../../user.server'
import type { AuthInput } from '../auth-schema'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

const registerSchema = zfd.formData(
  z.object({
    email: z.string(),
    password: z.string()
  })
)

export const registerStrategy = new FormStrategy(async ({ form }) => {
  const { email, password } = registerSchema.parse(form)

  const existingUser = await getUser({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  const user = await createUser({ email, password } as AuthInput)
  return user.id
})

const schema = zfd.formData(
  z.object({ email: z.string(), password: z.string() })
)

export const loginStrategy = new FormStrategy(async ({ form }) => {
  const { email, password } = schema.parse(form)

  const { user, passwordHash } = await getUserPasswordHash({ email })
  if (
    !user ||
    !passwordHash ||
    (passwordHash && !(await bcrypt.compare(password, passwordHash)))
  ) {
    throw new Error('Invalid email or password uuugh')
  }
  return user.id
})
