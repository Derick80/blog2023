import { Authenticator } from 'remix-auth'
import { Prisma, User } from '@prisma/client'
import { AuthProvider, AuthProviderUser } from './auth-shema'
import { prisma } from '~/.server/prisma.server'
import { z } from 'zod'
import { createCookieSessionStorage, redirect } from '@remix-run/node'


export const SESSION_ID_KEY:string = "sessionId";
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;
export const getSessionExpirationDate = () =>
  new Date(Date.now() + SESSION_EXPIRATION_TIME);

// Create a session storage that uses cookies to store the session data.  This is the basic session storage setup that I used in my Auth server files.

// 7.26.23 changed lax as 'lax' to lax as const
// revisit secure before production
const cookieOptions = {
    name: 'dch_com_auth_session',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
}

const authCookieSchema = z.object({
 userId: z.string().nullable(),
        email: z.string().nullable(),
        name: z.string().nullable(),
        avatar: z.string().nullable(),
  roles: z.array(z.string()).default([]),
  SESSION_ID_KEY: z.string(),
  expires: z.date().optional(),


})

export type AuthCookieSchema = z.infer<typeof authCookieSchema>

export const typeAuthSessionStorage = createCookieSessionStorage<AuthCookieSchema>({
    cookie: cookieOptions
})

const originCommitSession = typeAuthSessionStorage.commitSession

typeAuthSessionStorage.commitSession = async (session, options) => {
  if (options?.expires) {
    session.set('expires', options.expires)
  }
  if (options?.maxAge) {
    session.set('expires', new Date(Date.now() + options.maxAge * 1000))

  }
  const expires = session.has('expires') ? session.get('expires') : undefined

  const serialzedCookie = originCommitSession(session, {
    ...options,
    expires
    })
  return serialzedCookie


}


export const getAuthSession = async (request: Request) => {
  const authSession = await typeAuthSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const sessionId = authSession.get("SESSION_ID_KEY",);

  return { authSession, sessionId };
};



export const getUserId = async (request: Request) => {
  const { authSession, sessionId } = await getAuthSession(request);

  if (!sessionId) {
    return null;
  }
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      expirationDate: {
        gt: new Date(),
      },

      }
  },
  );
  if (!session) {
    throw redirect("/", {
      headers: {
        "set-cookie": await typeAuthSessionStorage.destroySession(authSession),
      },
    });

  }
  return session.userId;
}

export const requireAnonymous = async (request: Request) => {
  if (await getUserId(request)) {
    throw redirect("/");
  }
};

export const requireUserId = async (request: Request) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
};



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
            user: true
        }
    })

    return account
}

export const authenticator = new Authenticator<AuthProviderUser>(
    typeAuthSessionStorage,
    {
        throwOnError: true,
        sessionErrorKey: 'authError'
    }
)






export const setUserSessionAndCommit = async (
    request: Request,
    userId: User['id']
) => {
    const session = await typeAuthSessionStorage.getSession(request.headers.get('Cookie') ?? '')
  session.set('userId', userId)

    const headers = new Headers({
        'Set-Cookie': await sessionStorage.commitSession(session)
    })
    return headers
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

    if (input.password) {
        data.password = await createPasswordHash(input.password)
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
