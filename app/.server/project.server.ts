import { prisma } from './prisma.server'
import { Prisma } from '@prisma/client'
const getAllProjects = async () => {
    return await prisma.project.findMany({
        include: {
            technologyStacks: true,
            features: true,
            projectImages: true
        }
    })
}

const getProject = async ({ id }: { id: string }) => {
    return await prisma.project.findUnique({
        where: {
            id
        },
        include: {
            technologyStacks: true,
            features: true,
            projectImages: true
        }
    })
}

export { getAllProjects, getProject }
