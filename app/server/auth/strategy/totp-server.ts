import { TOTPStrategy } from 'remix-auth-totp'
import { prisma } from '~/server/prisma.server'
import { sendAuthEmail } from '../auth-email.server'

export const totpStrategy = new TOTPStrategy(
  {
    secret: process.env.ENCRYPTION_SECRET || 'some-secret-key',
    magicLinkGeneration: { callbackPath: '/magic-link' },

    createTOTP: async (data, expiresAt) => {
      await prisma.totp.create({ data: { ...data, expiresAt } })

      try {
        // Delete expired TOTP records (Optional).
        await prisma.totp.deleteMany({
          where: { expiresAt: { lt: new Date() } }
        })
      } catch (error) {
        console.warn('Error deleting expired TOTP records', error)
      }
    },
    readTOTP: async (hash) => {
      // Get the TOTP data from the database.
      return await prisma.totp.findUnique({ where: { hash } })
    },
    updateTOTP: async (hash, data) => {
      // Update the TOTP data in the database.
      await prisma.totp.update({ where: { hash }, data })
    },
    sendTOTP: async ({ email, code, magicLink, request }) => {
      await sendAuthEmail({ email, code, magicLink })
    }
  },
  async ({ email, form, magicLink, code }) => {
    if (form) console.log('form', form)
    if (magicLink) console.log('magicLink', magicLink)
    if (code) console.log('code', code)

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
