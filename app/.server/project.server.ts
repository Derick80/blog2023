import { SerializeFrom } from '@remix-run/node'
import { prisma } from './prisma.server'
import type { TechnologyStack as Tstack } from '@prisma/client'

export async function getProjects() {
  return await prisma.project.findMany({
    include: {
      technologyStacks: true,
      projectImages: true,
      features: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createProject({
  input
}: {
  input: {
    title: string
    description: string
    primaryImage: string
    projectUrl: string
    githubUrl: string
    status: string
    userId: string
    features: string[]
  }
}) {
  return await prisma.project.create({
    data: {
      title: input.title,
      description: input.description,
      primaryImage: input.primaryImage,
      projectUrl: input.projectUrl,
      githubUrl: input.githubUrl,
      status: input.status,
      userId: input.userId,
      features: {
        connectOrCreate: input.features.map((feature) => ({
          where: {
            value: feature
          },
          create: {
            value: feature
          }
        }))
      }
    }
  })
}

export async function updateProjectStatus({
  projectId,
  status
}: {
  projectId: string
  status: string
}) {
  return await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      status
    }
  })
}

export async function updateFeatures({
  projectId,
  features
}: {
  projectId: string
  features: string[]
}) {
  return await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      features: {
        set: features
      }
    }
  })
}

// technology stack

export type TechnologyStack = SerializeFrom<Tstack>
export async function getTechnologies() {
  const technologies = await prisma.technologyStack.findMany({
    orderBy: {
      value: 'asc'
    },
    distinct: ['value']
  })
  return technologies
}

export async function createTechnology({
  input
}: {
  input: {
    value: string
    url: string
    projectId: string
  }
}) {
  return await prisma.technologyStack.create({
    data: {
      value: input.value,
      url: input.url,
      projects: {
        connect: {
          id: input.projectId
        }
      }
    }
  })
}

export async function updateProjectTechnology({
  input
}: {
  input: {
    projectId: string
    value: string
    url: string
  }
}) {
  return await prisma.technologyStack.update({
    where: {
      id: input.projectId
    },
    data: {
      value: input.value,
      url: input.url,
      projects: {
        connect: {
          id: input.projectId
        }
      }
    }
  })
}

export async function removeTechnologyFromProject({
  projectId,
  technologyId
}: {
  projectId: string
  technologyId: string
}) {
  return await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      technologyStacks: {
        disconnect: {
          id: technologyId
        }
      }
    }
  })
}
