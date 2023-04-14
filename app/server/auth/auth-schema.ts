export type AuthInput = {
  email: string
  password: string
  username: string | ''
  avatarUrl?: string | ''
  redirectTo?: string
  token?: string
}
