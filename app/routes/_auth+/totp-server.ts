import { TOTPStrategy } from 'remix-auth-totp'
import { prisma } from '~/.server/prisma.server'
import { sendAuthEmail } from './email.server'
import { getSharedEnvs } from '~/.server/env.server'

const { ENCRYPTION_SECRET } = getSharedEnvs()
export const totpStrategy = new TOTPStrategy(
    {
        secret: ENCRYPTION_SECRET || 'some-secret-key',
        magicLinkPath: '/magic-link',

        sendTOTP: async ({ email, code, magicLink }) => {
            await sendAuthEmail({ email, code, magicLink })
        }
    },
    async ({ email, formData }) => {
        {
            formData
                ? console.log(Object.entries(formData.entries()))
                : console.log('No form data')
        }

        let user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    username: email.split('@')[0]
                }
            })
            if (!user) throw new Error('Whoops! Unable to create user.')
        }

        return user.id
    }
)
