import { Params, useMatches, useRouteLoaderData } from '@remix-run/react'
import React, { useMemo } from 'react'
import type { ZodError, ZodSchema, ZodType } from 'zod'
import type { CategoryMinimal, Post, UserType } from './server/schemas/schemas'
import { loader as rootLoaderType } from './root'
import { TechnologyStack } from './server/project.server'

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

interface Match {
  pathname: string
  params: Params<string>
  data: any
  handle: any
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Match['data'] | undefined {
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

// I modified this function to work with Zod schemas and Remix actions that use intent to determine which action to take

export async function validateAction2<T extends ZodType<any, any, any>>({
  request,
  schema
}: {
  request: Request
  schema: T
}): Promise<{
  formData: T['_output']
  errors: ActionErrors<T['_output']> | null
}> {
  const formDataEntries = await request.formData()
  const body: any = {}
  formDataEntries.forEach((value, key) => {
    body[key] = value
  })

  try {
    const formData = schema.parse(body)
    return { formData, errors: null }
  } catch (error) {
    console.log(error)

    const errors = error as ZodError<T>
    const formattedErrors: ActionErrors<T> = {}
    errors.issues.forEach((issue) => {
      formattedErrors[issue.path[0] as keyof T] = issue.message
    })
    return {
      formData: body as T,
      errors: formattedErrors
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
  }
  if (hours > 24 && hours < 48) {
    return `~1 day ago`
  } else {
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }
}

export function useTechnologies() {
  const { technologies } = useRouteLoaderData('projects') as {
    technologies: TechnologyStack[]
  }
  return technologies as TechnologyStack[]
}

export function useCategories() {
  const { categories } = useRouteLoaderData('root') as {
    categories: CategoryMinimal[]
  }
  // fetch categories from the server

  return categories as CategoryMinimal[]
}

type CatInput = {
  categories: CategoryMinimal[]
}
export function getUniqueCategories({
  categories
}: CatInput): CategoryMinimal[] {
  let uniqueCategories = Object.values(
    categories.reduce(
      (acc, curr) => {
        if (!acc[curr.value]) {
          acc[curr.value] = curr
        }
        return acc
      },
      {} as Record<string, CategoryMinimal>
    )
  )

  return uniqueCategories
}

export function capitalizeFirstLetter(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function useUpdateQueryStringValueWithoutNavigation(
  queryKey: string,
  queryValue: string
) {
  React.useEffect(() => {
    const currentSearchParams = new URLSearchParams(window.location.search)
    const oldQuery = currentSearchParams.get(queryKey) ?? ''
    if (queryValue === oldQuery) return

    if (queryValue) {
      currentSearchParams.set(queryKey, queryValue)
    } else {
      currentSearchParams.delete(queryKey)
    }
    const newUrl = [window.location.pathname, currentSearchParams.toString()]
      .filter(Boolean)
      .join('?')
    // alright, let's talk about this...
    // Normally with remix, you'd update the params via useSearchParams from react-router-dom
    // and updating the search params will trigger the search to update for you.
    // However, it also triggers a navigation to the new url, which will trigger
    // the loader to run which we do not want because all our data is already
    // on the client and we're just doing client-side filtering of data we
    // already have. So we manually call `window.history.pushState` to avoid
    // the router from triggering the loader.
    window.history.replaceState(null, '', newUrl)
  }, [queryKey, queryValue])
}

export function filterPosts(
  posts: Omit<Post, 'comments'>[],
  searchString: string
) {
  if (!searchString) return posts

  const searches = new Set(searchString.split(' '))
  const allResults = posts.filter((post) => {
    const category = post.categories.map((category) => category.value)
    return category.includes(searchString)
  })

  if (searches.size < 2) {
    return allResults
  }

  // if there are multiple words, we'll conduct an individual search for each word
  const [firstWord, ...restWords] = searches.values()
  if (!firstWord) {
    // this should be impossible, but if it does happen, we'll just return an empty array
    return []
  }

  let individualWordResults = posts.filter((post) => {
    const category = post.categories.map((category) => category.value)
    return category.includes(firstWord)
  })

  // if there are more than one word, we'll filter the results of the first word
  // and then filter the results of the second word, and so on

  for (const word of restWords) {
    const searchResult = posts.filter((post) => {
      const category = post.categories.map((category) => category.value)
      return category.includes(word)
    })

    individualWordResults = individualWordResults.filter((post) =>
      searchResult.includes(post)
    )
  }

  return Array.from(new Set([...allResults, ...individualWordResults]))
}

// export a typesafe function to get the root data
export function useRootLoaderData() {
  //the ! will tell TS that the type is not nullable (not null or undefined)
  return useRouteLoaderData<typeof rootLoaderType>('root')!
}
