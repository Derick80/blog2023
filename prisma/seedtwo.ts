import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function generateTestData(numberofPosts: number) {
  // create a new user
  const basePassword = 'EGtAUQgz'
  const passwords = await bcrypt.hash(basePassword, 10)
  const user = await prisma.user.create({
    data: {
      email: faker.internet.exampleEmail(),
      username: faker.name.firstName(),
      avatarUrl: faker.image.avatar(),
      password: passwords
    }
  })

  for (let i = 0; i < numberofPosts; i++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        description: faker.lorem.paragraph(2),
        content: faker.lorem.paragraph(4),
        imageUrl: faker.image.imageUrl(),
        published: true,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })
  }
}

async function generateMe(numberofPosts: number) {
  // clean up the database
  const email = (await process.env.SEED_EMAIL) as string

  await prisma.user
    .delete({
      where: {
        email
      }
    })
    .catch(() => {
      console.log('No user to delete')
    })
  const hashedPassword = (await process.env.HASHEDPASSWORD) as string

  const me = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: 'DerickC',
      avatarUrl: `https://res.cloudinary.com/dch-photo/image/upload/v1679953623/p6ii8bxgb3v3n3zpvg0d.webp`
    }
  })

  for (let i = 0; i < numberofPosts; i++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        description: faker.lorem.paragraph(2),
        content: faker.lorem.paragraph(4),
        imageUrl: faker.image.imageUrl(),
        published: true,
        user: {
          connect: {
            id: me.id
          }
        }
      }
    })
  }
}

async function seed() {
  await generateTestData(20)
  await generateTestData(5)
  await generateMe(5)
  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
