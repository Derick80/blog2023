// app/auth.server.ts
import type { DiscordProfile } from 'remix-auth-discord'
import { DiscordStrategy } from 'remix-auth-discord'
import { getAccount } from './accountService.server'
import { createUser } from '../../user.server'

export interface DiscordUser {
  id: DiscordProfile['id']
  userName: DiscordProfile['displayName']
  avatarUrl: DiscordProfile['__json']['avatar']
  email: DiscordProfile['__json']['email']
  accessToken: string
  refreshToken: string
}

const clientID = process.env.DISCORD_CLIENT_ID as string
if (!clientID) throw new Error('DISCORD_CLIENT_ID is not defined')
const clientSecret = process.env.DISCORD_CLIENT_SECRET as string
if (!clientSecret) throw new Error('DISCORD_CLIENT_SECRET is not defined')

export const discordCallbackUrl = process.env.DISCORD_CALLBACK_URL as string
if (!discordCallbackUrl) throw new Error('DISCORD_CALLBACK_URL is not defined')

export const discordStrategy = new DiscordStrategy(
  {
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: discordCallbackUrl,
    // Provide all the scopes you want as an array
    scope: ['identify', 'email']
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const account = await getAccount({
      provider: profile.provider,
      providerAccountId: profile.id
    })

    if (account) return account.userId

    const user = await createUser({
      email: profile.emails ? profile.emails[0].value : '',
      username: profile.displayName,
      avatarUrl: profile.photos ? profile.photos[0].value : '',
      account: {
        provider: profile.provider,
        providerAccountId: profile.id,
        accessToken: accessToken
      }
    })

    return user.id
  }
)
