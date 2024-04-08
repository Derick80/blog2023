import { Authenticator } from 'remix-auth'
import { User } from '@prisma/client'
import { prisma } from '~/.server/prisma.server'
import { z } from 'zod'
import { createCookieSessionStorage, redirect, Session } from '@remix-run/node'
import { discordStrategy } from './discord.server'
import type { Prisma } from '@prisma/client'
import { addDays, addHours, isBefore } from 'date-fns'
import { Theme } from '~/.server/theme.server.ts'

export type ProviderUser = {
    userId: string
    username: string
    email: string
    avatarUrl: string
    role: string
    provider: string
    providerId: string
    token: string
  refreshToken?: string
      sessionId?: string
    theme?: Theme

}
export const SESSION_ID_KEY: string = 'sessionId'
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
    new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const DISCORD_PROVIDER_NAME = 'discord'

export const providerNames = [DISCORD_PROVIDER_NAME] as const
export const ProviderNameSchema = z.enum(providerNames)

export type ProviderName = z.infer<typeof ProviderNameSchema>

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


export const sessionStorage = createCookieSessionStorage<ProviderUser>({
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

export const authenticator = new Authenticator<ProviderUser>(sessionStorage, {
  sessionKey: SESSION_ID_KEY,
    throwOnError: true,
    sessionErrorKey: 'authError'
})

authenticator.use(discordStrategy, 'discord')

export const getUserId = (request: Request) => {
    return authenticator.isAuthenticated(request)
}

export const isAuthenticated = async (request: Request) => {
    const user = await authenticator.isAuthenticated(request)
    console.log(user,'user from isAuthenticated');
    return user

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

              include: {
                    sessions: true


      }
          }
      }
  })

  return account
}

export const getUser = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            sessions: true,
            accounts: true,
        }
    })
}

export const createUser = async (userData: Omit<ProviderUser, "userId" | "role">) => {
    return await prisma.user.create({
        data: {
            email: userData.email,
            username: userData.username,
            avatarUrl: userData.avatarUrl,

            sessions: {
                create: {
                    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                }
            },
            accounts: {
                create: {
                    provider: userData.provider,
                    providerAccountId: userData.providerId,
                    accessToken: userData.token,
                    refreshToken: userData.refreshToken,
                }
            }

        },
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
                    refreshToken: true,
                }
            },
            }


    })
}
