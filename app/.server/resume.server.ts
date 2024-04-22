import { prisma } from './prisma.server'

const getResume = async () => {
    const resume = await prisma.resume.findFirst({
        include: {
            skills: true,
            publications: true,
            education: {
                include: {
                    duties: true
                }
            },
            professionalExperience: {
                include: {
                    duties: true
                }
            }
        }
    })
    return resume
}

export { getResume }
