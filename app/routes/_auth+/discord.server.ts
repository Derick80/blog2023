import { DiscordStrategy } from 'remix-auth-discord'
import { createUser, getAccount, ProviderUser } from './auth.server'

export const discordStrategy = new DiscordStrategy(
    {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        // Provide all the scopes you want as an array
        scope: ['identify', 'email']
    },
    async ({ accessToken, refreshToken, profile }): Promise<ProviderUser> => {
        const userEmail = profile.__json.email
        if (!userEmail) {
            throw new Error('Email is required')
        }

        const account = await getAccount({
            provider: profile.provider,
            providerAccountId: profile.id
        })

        if (account) {
            // If the user is already in the database, update the token and return the user
            return {
                userId: account.user.id,
                username: account.user.username || '',
                email: account.user.email,
                avatarUrl: account.user.avatarUrl || '',
                role: account.user.role,
                provider: account.provider,
                providerId: account.providerAccountId,
                token: accessToken,
                refreshToken
            }
        }

        //   If the user is not in the database, create a new user
        const userData = {
            email: userEmail,
            username: profile.displayName || '',
            avatarUrl: profile.__json.avatar_decoration || '',
            provider: profile.provider,
            providerId: profile.id,
            token: accessToken,
            refreshToken
        }

        const user = await createUser(userData)

        return {
            userId: user.id,
            username: user.username || '',
            email: user.email,
            avatarUrl: user.avatarUrl || '',
            role: user.role,
            provider: profile.provider,
            providerId: profile.id,
            token: accessToken,
            refreshToken
        }
    }
)
