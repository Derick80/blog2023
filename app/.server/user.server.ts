import { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'

export const defaultSelect = {
    id: true,
    email: true,
    username: true,
    avatarUrl: true,
    role: true
}

export const getUser = async (input: Prisma.UserWhereUniqueInput) => {
    const user = await prisma.user.findUnique({
        where: input,
        select: defaultSelect
    })

    return user
}

export const getUsers = async () => {
    const users = await prisma.user.findFirst({
        select: defaultSelect,
    })

    return users
}

