import { Params, useMatches } from '@remix-run/react'
import React from 'react'
import { useMemo } from 'react'
import { Button } from '~/components/ui/button'
import * as mdxBundler from "mdx-bundler/client/index.js";

export type UserType = {
    userId: string
    email: string
    username: string
    avatarUrl: string
    role: string
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

const mdxComponents = {
  button: Button,
};
/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
    const Component = mdxBundler.getMDXComponent(code,
        {
            components: mdxComponents,
        }
  );



    return Component;
}



export function useMdxComponent(code: string, globals?: Record<string, unknown>) {
  return React.useMemo(() => {

    const component = getMdxComponent(code);
    return component;
  }, [code]);
}
