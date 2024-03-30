import { Strategy } from 'remix-auth'

export type AuthProviderUser = {
    id: string
    email: string
    username?: string
    avatarUrl?: string
    role?: string
    provider?: string
    providerAccountId?: string
    accessToken?: string
    refreshToken?: string
}

// Define a user type for cleaner typing

export interface AuthProvider {
    getAuthStrategy(): Strategy<AuthProviderUser, any>
    resolveConnectionData(providerId: string): Promise<{
        displayName: string
        link?: string | null
    }>
}
