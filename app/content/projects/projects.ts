import { ProjectImage as PImages, TechnologyStack as Tstack, User } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'



export type ProjectImage = SerializeFrom<PImages>

export type TechnologyStack = SerializeFrom<Tstack>

export type Project = {
    id: string
    title: string
    description: string
    primaryImage: string | null
    projectUrl: string
    githubUrl: string
    createdAt: string
    status: string
    projectImages: ProjectImage[]
    technologyStacks: TechnologyStack[]
    features: { id: string; value: string }[]
}
export const projects = [
    {
        title: 'ACMG Variant Classification',
        description: 'A web app for ACMG Variant Classification',
        primaryImage:
            'https://res.cloudinary.com/dch-photo/image/upload/v1684398538/myr4wowmklv2pwyyumsj.webp',
        projectUrl: `https://main--jovial-platypus-2a8460.netlify.app/`,
        githubUrl: `https://github.com/Derick80/genes_23`,
        status: 'In Progress',
        features: [
            { value: 'variant classification' },
            { value: 'gene search' },
            { value: 'gene list' },
            { value: 'variant list' },
            { value: 'variant search' },
            { value: 'variant details' },
            { value: 'gene details' },
            { value: 'variant classification details' }
        ],
        technologyStacks: [

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

        status: 'Completed',
        features: [
            { value: 'Image Carousel' },
            { value: 'Pagination' },
        ],
        technologyStacks: [
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


