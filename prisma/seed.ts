import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed(){
    const email = (await process.env.SEED_EMAIL) as string

    await prisma.user.delete({
        where: {
            email
        }

    }).catch(()=>{
        console.log("No user to delete")
    })

    const hashedPassword = await process.env.HASHEDPASSWORD as string

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            username:"DerickC",
            avatarUrl: faker.internet.avatar()}

    })

    console.log(`Database has been seed. `)
}

seed()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }
)
