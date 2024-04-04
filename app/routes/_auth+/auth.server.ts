import { Authenticator } from 'remix-auth'
import { User } from '@prisma/client'
import { prisma } from '~/.server/prisma.server'
import { z } from 'zod'
import { createCookieSessionStorage, redirect, Session } from '@remix-run/node'
import { discordStrategy } from './discord.server'
import { totpStrategy } from './totp-server'
import type { Prisma } from '@prisma/client'
import { randomBytes } from 'crypto'
import { addDays, addHours, isBefore } from 'date-fns'
import { getUser } from '~/.server/user.server'
import { Theme } from '~/.server/session.server'

export type TokenType = 'RESET_PASSWORD' | 'REFRESH_TOKEN'
export const SESSION_ID_KEY: string = 'sessionId'
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
    new Date(Date.now() + SESSION_EXPIRATION_TIME)

// Create a session storage that uses cookies to store the session data.  This is the basic session storage setup that I used in my Auth server files.

// 7.26.23 changed lax as 'lax' to lax as const
// revisit secure before production
const cookieOptions = {
    name: 'dch_com_auth_session',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
}

type SessionData = {
    userId: User['id']
    role: User['role']
    sessionId: string
    theme?: Theme
}

export const sessionStorage = createCookieSessionStorage<SessionData>({
    cookie: cookieOptions
})
export const getSession = async (request: Request) => {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )

    return session
}

export const commitSession = async (session: Session) => {
    const headers = new Headers({
        'Set-Cookie': await sessionStorage.commitSession(session)
    })

    return headers
}

export const authenticator = new Authenticator(sessionStorage, {
    throwOnError: true,
    sessionErrorKey: 'authError'
})

authenticator.use(discordStrategy, 'discord')
authenticator.use(totpStrategy, 'totp')

export const getUserId = (request: Request) => {
    return authenticator.isAuthenticated(request)
}

export const isAuthenticated = async (request: Request) => {
    const userId = await authenticator.isAuthenticated(request)
    if (!userId) return null
    return getUser({ id: userId })
}

export const setUserSession = async (session: Session, id: User['id']) => {
    session.set(authenticator.sessionKey, id)

    return session
}

export const setUserSessionAndCommit = async (
    request: Request,
    id: User['id']
) => {
    const session = await getSession(request)
    await setUserSession(session, id)
    const headers = await commitSession(session)

    return headers
}

export const requireAnonymous = async (request: Request) => {
    if (await getUserId(request)) {
        throw redirect('/')
    }
}

export const requireUserId = async (request: Request) => {
    const userId = await getUserId(request)

    if (!userId) {
        throw redirect('/login')
    }

    return userId
}

export const getAccount = async ({
    provider,
    providerAccountId
}: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput) => {
    const account = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider,
                providerAccountId
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    avatarUrl: true,
                    role: true,
                    accounts: {
                        select: {
                            provider: true,
                            providerAccountId: true,
                            accessToken: true,
                            refreshToken: true
                        }
                    }
                }
            }
        }
    })

    return account
}
const getTokenExpiration = (tokenType: TokenType) => {
    switch (tokenType) {
        case 'RESET_PASSWORD':
            return addHours(new Date(), 1)
        case 'REFRESH_TOKEN':
            return addDays(new Date(), 60)
        default:
            return null
    }
}

export const generateToken = () => {
    return randomBytes(20).toString('hex')
}

export const createToken = async (
    tokenType: TokenType,
    input: Omit<Prisma.TokenCreateInput, 'token' | 'type' | 'expiresAt'>
) => {
    const token = generateToken()
    const expiresAt = getTokenExpiration(tokenType)

    const created = await prisma.token.create({
        data: {
            ...input,
            token,
            type: tokenType,
            expiresAt
        }
    })

    return created
}

export const validateToken = async (tokenType: TokenType, token?: string) => {
    if (!token) return false

    const savedToken = await prisma.token.findUnique({
        where: {
            token_type: {
                token,
                type: tokenType
            }
        }
    })

    if (
        !savedToken ||
        savedToken.usedAt ||
        (savedToken.expiresAt && !isBefore(new Date(), savedToken.expiresAt))
    ) {
        return false
    }

    const updated = await prisma.token.update({
        where: { id: savedToken.id },
        data: { usedAt: new Date() },
        include: { user: true }
    })

    return updated.user
}

export const createUser = async (
    input: Prisma.UserCreateInput & {
        password?: string
        account?: Omit<Prisma.AccountCreateInput, 'user'>
    }
) => {
    const data: Prisma.UserCreateInput = {
        email: input.email
    }

    if (input.account) {
        data.accounts = {
            create: [
                {
                    provider: input.account.provider,
                    providerAccountId: input.account.providerAccountId,
                    accessToken: input.account.accessToken,
                    refreshToken: input.account.refreshToken
                }
            ]
        }
    }

    const user = await prisma.user.create({
        data,
        select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            role: true,

            accounts: {
                select: {
                    provider: true,
                    providerAccountId: true,
                    accessToken: true,
                    refreshToken: true
                }
            }
        }
    })

    return user
}
