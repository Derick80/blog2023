import { prisma } from '~/.server/prisma.server';
import { faker } from '@faker-js/faker';


// use faker.js to generate random users

async function seed() {

  //  clean up the db
  await prisma.category.deleteMany();
  await prisma.content.deleteMany();
  await prisma.love.deleteMany();
  await prisma.user.deleteMany({
    where: {
      NOT: {
        id:'clukpmixh0000toxl2420bzem'
      }
    }
  }
  );

  // seed the db with content
  await Promise.all(
    mdxPostsToSeed.flat().map(async (content) => {
      const categories = content.categories.map((category) => {
        return { create: { value: category } };
      });

      return prisma.content.create({
        data: {
          slug: content.slug,
          title: content.title,
          author: content.author,
          description: content.description,
          datePublished: content.datePublished,
          categories: {
            set: content.categories
          }
        },


        });
    })
  );

  const slugs = await prisma.content.findMany({
    select: {
      slug: true
    }
  });


  //  get a random slug from the slugs array
  const randomSlug = () => {
    const index = Math.floor(Math.random() * slugs.length);
    return slugs[index].slug;
  }

  await generateRandomUsers(40);



  const users = await prisma.user.findMany({
    select: {
      id:true
    }
  });

  for (let i = 0; i < users.length; i++) {
     await prisma.love.create({
      data: {
        userId: users[i].id,
        contentId: randomSlug(),
      },
    });

  }


  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


const generateRandomUsers = async (numberofUsers: number) => {
  for (let i = 0; i < numberofUsers; i++) {
     await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        avatarUrl: faker.image.url(),
        role: "USER",
      },
    });
  }

}

export const categoriesToSeed = [
  { value: "javascript", label: "Javascript" },
  { value: "react", label: "React" },
  { value: "node", label: "Node" },
  {
    value: "typescript",
    label: "typescript",
  },
  { value: "next", label: "Next" },
  { value: "remix", label: "Remix" },
  { value: "prisma", label: "Prisma" },
  { value: "tailwindCss", label: "TailwindCss" },
  { value: "cloudinary", label: "Cloudinary" },
  { value: "postgres", label: "Postgres" },
  { value: "coding", label: "Coding" },
  { value: "genetics", label: "Genetics" },
  { value: "biology", label: "Biology" },
  { value: "bcience", label: "Science" },
  { value: "technology", label: "Technology" },
  { value: "books", label: "Books" },
  { value: "travel", label: "Travel" },
  { value: "music", label: "Music" },
  { value: "japan", label: "Japan" },
];


const mdxPostsToSeed = [
  [
  {
  "title": "ACMG Criteria",
  "author": "Derick Hoskinson, Ph.D.",
  "description": "ACMG Criteria Usage at VariantAlleles.com",
  "datePublished": "2023-11-06",
  "published": false,
  "categories": [
    "planning",
    "documentation",
    "ACMG"
  ],
  "url": "../content/blog/acmg-criteria.mdx",
  "slug": "acmg-criteria"
},
  {
    "title": "Community",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "Building a Community at VariantAlleles.com",
    "datePublished": "2023-11-17",
    "published": true,
    "categories": [
      "scoping",
      "planning",
      "documentation"
    ],
    "slug": "community"
  },
  {
    "title": "Database",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "Database Planning for VariantAlleles.com",
    "datePublished": "2023-11-06",
    "published": true,
    "categories": [
      "databases",
      "planning",
      "documentation"
    ],
    "slug": "database"
  },
  {
    "title": "Deployment",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "Deployment Planning for VariantAlleles.com",
    "datePublished": "2023-11-15",
    "published": true,
    "categories": [
      "scoping",
      "planning",
      "deployment",
      "documentation"
    ],
    "slug": "deployment"
  },
  {
    "title": "Genetics",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "Genetics Planning for VariantAlleles.com",
    "datePublished": "2023-11-06",
    "published": true,
    "categories": [
      "genetics",
      "planning",
      "documentation"
    ],
    "slug": "genetics"
  },
  {
    "title": "PDF Library",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "PDF  Planning for VariantAlleles.com",
    "datePublished": "2023-11-15",
    "published": true,
    "categories": [
      "feature",
      "documentation",
      "KDB"
    ],
    "slug": "pdf-library"
  },
  {
    "title": "Variant Alleles",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "Overview of VariantAlleles.com",
    "datePublished": "2023-11-15",
    "published": true,
    "categories": [
      "Fall-2023-Planning",
      "planning",
      "documentation"
    ],
    "slug": "variant-alleles"
  },
  {
    "title": "ACMG Variant Pathogenicity Calculator",
    "author": "Derick Hoskinson, Ph.D.",
    "description": "ACMG Criteria Usage at VariantAlleles.com",
    "datePublished": "2023-11-06",
    "published": true,
    "categories": [
      "feature",
      "documentation",
      "ACMG",
      "tool"
    ],
    "slug": "variant-calculator"
  }
]
]