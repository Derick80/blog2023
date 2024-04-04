import { DiscordStrategy, type DiscordProfile } from 'remix-auth-discord'
import { createUser, getAccount } from './auth.server'

export interface DiscordUser {
    id: DiscordProfile['id']
    displayName: DiscordProfile['displayName']
    avatar: DiscordProfile['__json']['avatar']
    email: DiscordProfile['__json']['email']
    locale?: string
    accessToken: string
    refreshToken: string
}
export const discordStrategy = new DiscordStrategy<DiscordUser>(
    {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        // Provide all the scopes you want as an array
        scope: ['identify', 'email']
    },
    async ({ accessToken, refreshToken, profile }): Promise<DiscordUser> => {
        const account = await getAccount({
            provider: profile.provider,
            providerAccountId: profile.id
        })

        if (account)
            return {
                id: account.userId,
                displayName: account.user.username || profile.displayName,
                avatar: account.user.avatarUrl,
                email: account.user.email,
                locale: profile.__json.locale,
                accessToken: accessToken,
                refreshToken: account.refreshToken || ''
            }

        const newUser = await createUser({
            email: profile.emails ? profile.emails[0].value : '',
            username: profile.displayName,
            avatarUrl: profile.photos ? profile.photos[0].value : '',
            account: {
                provider: profile.provider,

                providerAccountId: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })

        const user = newUser.accounts.map((account) => ({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            avatarUrl: newUser.avatarUrl,
            role: newUser.role,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken
        }))[0]

        return {
            id: user.id,
            displayName: user.username || profile.displayName,
            avatar: user.avatarUrl,
            email: user.email,
            locale: profile.__json.locale,
            accessToken: user.accessToken || '',
            refreshToken: user.refreshToken || ''
        }
    }
)
