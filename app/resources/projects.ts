import { ProjectImage } from '@prisma/client'
import type { User } from '~/server/schemas/schemas'
import type { CategoryMinimal } from '~/server/schemas/schemas'

export type ProjectStatus = 'Active' | 'Completed' | 'Abandoned'
export type Project = {
  id: string
  title: string
  description: string
  primaryImage: string
  projectUrl: string
  githubUrl: string
  createdAt: string
  userId: string
  status: ProjectStatus | string
  projectImages: ProjectImage[]
  features: string[]
  user: Omit<User, 'role'>
}
export const projects = [
  {
    title: 'ACMG Variant Classification',
    description: 'A web app for ACMG Variant Classification',
    primaryImage:
      'https://res.cloudinary.com/dch-photo/image/upload/v1684398538/myr4wowmklv2pwyyumsj.webp',
    projectUrl: `https://main--jovial-platypus-2a8460.netlify.app/`,
    githubUrl: `https://github.com/Derick80/genes_23`,
    createdAt: '2023-05-18T21:52:08.779Z',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Active',
    features: [
      'variant classification',
      'gene search',
      'gene list',
      'variant list',
      'variant search',
      'variant details',
      'gene details',
      'variant classification details',
      'variant classification'
    ],
    categories: [
      {
        value: 'Remix-run',
        url: 'https://remix.run/'
      },
      {
        value: 'HTML Forms',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
      },
      {
        value: 'TailwindCSS',
        url: 'https://tailwindcss.com/'
      },

      {
        value: 'Prisma',
        url: 'https://www.prisma.io/'
      },
      {
        value: 'Postgres',
        url: 'https://www.postgresql.org/'
      }
    ]
  },

  {
    title: 'A Cellular Wind',
    description:
      "A Cellular Wind is a blog that I'm writing using markdown.  It's really my first foray into MD",
    primaryImage:
      'https://res.cloudinary.com/dch-photo/image/upload/v1681854400/wzrjntlj3s8aqdbgmaxc.png',
    projectUrl: 'https://cellularwind.com/',
    githubUrl: 'https://github.com/Derick80/astro-blog',
    createdAt: '2023-04-18T21:52:08.779Z',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Active',

    categories: [
      {
        value: 'Astro',
        url: 'https://docs.astro.build/en/getting-started/'
      },
      {
        value: 'Markdown',
        url: 'https://www.markdownguide.org/'
      }
    ]
  },

  {
    title: 'To Do App',
    description: 'A simple todo application created with Remix',
    primaryImage:
      'https://res.cloudinary.com/dch-photo/image/upload/v1681854627/ve402op3lbngdzjuhoby.png',
    projectUrl: 'https://dchtodos.fly.dev/',
    githubUrl: 'https://github.com/Derick80/todos',
    createdAt: '2023-04-17T21:52:08.779Z',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Completed',

    categories: [
      {
        value: 'Remix-run',
        url: 'https://remix.run/'
      },
      {
        value: 'HTML Forms',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
      },
      {
        value: 'TailwindCSS',
        url: 'https://tailwindcss.com/'
      },

      {
        value: 'Prisma',
        url: 'https://www.prisma.io/'
      },
      {
        value: 'Postgres',
        url: 'https://www.postgresql.org/'
      }
    ]
  },

  {
    title: 'DNA Reverse Complement ',
    description:
      'A simple DNA reverse complement app.  Enter a DNA sequence and get the reverse complement back',
    primaryImage:
      'https://res.cloudinary.com/dch-photo/image/upload/v1679951416/f4druehyvkialpjgajbm.png',
    projectUrl: 'https://dna-tawny.vercel.app/',
    githubUrl: 'https://github.com/Derick80/dna',
    createdAt: '2023-04-17T21:52:08.779Z',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Completed',

    categories: [
      {
        value: 'Remix-run',
        url: 'https://remix.run/'
      },
      {
        value: 'HTML Forms',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
      },
      {
        value: 'TailwindCSS',
        url: 'https://tailwindcss.com/'
      },

      {
        value: 'Prisma',
        url: 'https://www.prisma.io/'
      },
      {
        value: 'Postgres',
        url: 'https://www.postgresql.org/'
      }
    ]
  },

  {
    title: 'T3 Stack S3 Image Upload with Blog Post',
    description:
      'I wanted to try a new technology stack so I replicated Image upload functionality from my social media apps in the T3 stack.',
    primaryImage:
      'https://res.cloudinary.com/dch-photo/image/upload/v1680132957/rbk0xpqxkptfi90ddnhu.png',
    projectUrl: 'https://trpc-blog-two.vercel.app/',
    githubUrl: 'https://github.com/Derick80/trpc-blog',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Completed',

    categories: [
      {
        value: 'Remix-run',
        url: 'https://remix.run/'
      },
      {
        value: 'HTML Forms',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
      },
      {
        value: 'TailwindCSS',
        url: 'https://tailwindcss.com/'
      },

      {
        value: 'Prisma',
        url: 'https://www.prisma.io/'
      },
      {
        value: 'Postgres',
        url: 'https://www.postgresql.org/'
      }
    ]
  },
  {
    title: 'Japan 2023 Image Carousel',
    description:
      'An Image Carousel built with React and Typescript and Tailwindcss',
    primaryImage:
      'https://remix-bucket.s3.us-east-2.amazonaws.com/mystock/photogallery.png',
    projectUrl: 'https://photogallery-3r9pc82rg-derick80.vercel.app/',
    githubUrl: 'https://github.com/Derick80/photogallery',
    createdAt: '2023-04-15T21:52:08.779Z',
    userId: '6d11174e-9d65-4bef-949f-8e1ea3496ad3',
    status: 'Completed',

    categories: [
      {
        value: 'Remix-run',
        url: 'https://remix.run/'
      },
      {
        value: 'HTML Forms',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'
      },
      {
        value: 'TailwindCSS',
        url: 'https://tailwindcss.com/'
      },

      {
        value: 'Prisma',
        url: 'https://www.prisma.io/'
      },
      {
        value: 'Postgres',
        url: 'https://www.postgresql.org/'
      }
    ]
  }
]
