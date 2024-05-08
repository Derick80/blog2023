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
const Paragraph = (props: {
    children?: React.ReactNode
}) => {
    if (typeof props.children !== 'string' && props.children === 'img') {
        return <>{props.children}</>
    }

        return <p
                className = 'leading-7 [&:not(:first-child)]:mt-6'
            {  ...props } />
}


const CodeBlock = (props: {
    children?:React.ReactNode
})=>{

    return <code
        className=' text-red-500'
    {...props} />
}

const Span = (props: {
    children?:React.ReactNode
})=>{

    return <span
        className=' text-red-500'
    {...props} />
}
 const mdxComponents = {
     p: Paragraph,
};
/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
export function getMdxComponent(code: string) {
  const Component = mdxBundler.getMDXComponent(code);

  function DCHMdxComponent({
    components,
    ...rest
  }: Parameters<typeof Component>["0"]) {
    return (
      <Component components={{ ...mdxComponents, ...components }} {...rest} />
    );
  }

  return DCHMdxComponent;
}

export function useMdxComponent(code: string) {
  return React.useMemo(() => {

    const component = getMdxComponent(code);
    return component;
  }, [code]);
}

