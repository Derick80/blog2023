import { prisma } from './prisma.server'

const getResume = async () => {
  return await prisma.resume.findFirst({
    include: {
      professionalExperience: {
        include: {
          duties: true
        }
      },
      education: true
    }
  })
}

export { getResume }
