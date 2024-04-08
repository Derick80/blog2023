import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type HeaderProps = React.HTMLAttributes<HTMLHeadingElement> & {
    ref?: React.Ref<HTMLHeadingElement>
    className?: string
}

export const H1 = React.forwardRef<HTMLHeadingElement, HeaderProps>(
    ({ className, children, ...props }, ref) => (
        <h1
            ref={ ref }
            className={ cn(
                'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                className
            ) }
            { ...props }
        >
            { children }
        </h1>
    )
)
H1.displayName = 'H1'

export const H2 = React.forwardRef<HTMLHeadingElement, HeaderProps>(
    ({ className, children, ...props }, ref) => (
        <h2
            ref={ ref }
            className={ cn(
                'scroll-m-20 border-b border-primary pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
                className
            ) }
            { ...props }
        >
            { children }
        </h2>
    )
)
H2.displayName = 'H2'

export const H3 = React.forwardRef<HTMLHeadingElement, HeaderProps>(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ ref }
            className={ cn(
                'scroll-m-20 text-xl font-semibold tracking-tight',
                className
            ) }
            { ...props }
        >
            { children }
        </h3>
    )
)

H3.displayName = 'H3'

export function P ({
    children,
    className,
    ...props
}: {
    children: ReactNode
    className?: string
    props?: React.HTMLAttributes<HTMLDivElement>
}) {
    return (
        <p
            className={ cn('leading-7 [&:not(:first-child)]:mt-6', className) }
            { ...props }
        >
            { children }
        </p>
    )
}

export function Large ({
    children,
    className
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={ cn('text-lg font-semibold', className) }>{ children }</div>
    )
}

export function Medium ({
    children,
    className
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={ cn('text-base font-semibold', className) }>{ children }</div>
    )
}

export function Small ({
    children,
    className
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <small className={ cn('text-sm font-medium leading-none', className) }>
            { children }
        </small>
    )
}

export function Muted ({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={ cn('text-sm text-muted-foreground', className) }>
            { children }
        </div>
    )
}

export function Caption ({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={ cn('text-xs text-muted-foreground', className) }>
            { children }
        </div>
    )
}