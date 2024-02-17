import { prisma } from './prisma.server'

export async function getCV() {
  return await prisma.resume.findFirst({
    include: {
      professionalExperience: {
        include: {
          duties: true
        }
      },
      education: {
        include: {
          duties: true
        }
      },
      publications: true
    }
  })
}
