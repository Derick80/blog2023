import { useMatches } from '@remix-run/react'
import { useMemo } from 'react'
import type { ZodError, ZodSchema } from 'zod'
import type { Category, UserType } from './server/schemas/schemas'
import React from 'react'
import { Link, type LinkProps } from '@remix-run/react'

const DEFAULT_REDIRECT = '/'

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  )
  return route?.data
}

function isUser(user: any): user is UserType {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function useOptionalUser(): UserType | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}

export function useUser(): UserType {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
    )
  }
  return maybeUser
}

// Try this sometime
export function useCategories() {
  const data = useMatchesData('root')
  if (!data || !data.categories) {
    throw new Error(
      'No categories found in root loader, but categories are required by useCategories.'
    )
  }
  return data.categories as Category
}
type ActionErrors<T> = Partial<Record<keyof T, string>>

export async function validateAction<ActionInput>({
  request,
  schema
}: {
  request: Request
  schema: ZodSchema
}) {
  const body = Object.fromEntries(await request.formData()) as ActionInput

  try {
    const formData = schema.parse(body) as ActionInput
    return { formData, errors: null }
  } catch (error) {
    console.log(error)

    const errors = error as ZodError<ActionInput>

    return {
      formData: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput

        acc[key] = curr.message
        return acc
      }, {})
    }
  }
}
// format date function to return data as X hours/days ago
export function formatDateAgo(date: string) {
  const newDate = new Date(date)
  const time = newDate.getTime()
  const now = Date.now()
  const diff = now - time
  const hours = Math.floor(diff / 1000 / 60 / 60)
  if (hours < 24) {
    return `${hours} hours ago`
  } else {
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }
}
