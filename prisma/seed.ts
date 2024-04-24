import { prisma } from '~/.server/prisma.server';
import { faker } from '@faker-js/faker';
import { education, professionalExperience, pubs, resume_basics, skills } from '~/content/resume/resume';
import { projects } from '~/content/projects/projects';


// use faker.js to generate random users

async function seed() {

  //  clean up the db
  await prisma.category.deleteMany();
  await prisma.content.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.professionalExperience.deleteMany();
  await prisma.duties.deleteMany();
  await prisma.education.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectFeatures.deleteMany();
  await prisma.technologyStack.deleteMany();
  await prisma.postImage.deleteMany();
  await prisma.love.deleteMany();
  // delete all users except the admin user
  await prisma.user.deleteMany({
    where: {
      NOT: {
        id:'clukpmixh0000toxl2420bzem'
      }
    }
  }
  );

for (const post of mdxPostsToSeed) {
    const categories = post.categories.map((category) => ({
      where: { title: category },
      create: { title: category },
    }));

    try {
      await prisma.content.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          author: post.author,
          description: post.description,
          datePublished: post.datePublished,
          published: post.published,
          categories: { connectOrCreate: categories },
        },
        create: {
          title: post.title,
          author: post.author,
          description: post.description,
          datePublished: post.datePublished,
          published: post.published,
          slug: post.slug,
          categories: { connectOrCreate: categories },
        },
      });
      console.log(`Post "${post.title}" successfully seeded!`);
    } catch (error) {
      console.error(`Error seeding post "${post.title}":`, error);
    }
}

  await generateResume();
  await generateProjects();
  await generateRandomUsers(10);




  // seed the db with content

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


const generateResume= async ()=> {
  const init_resume = await prisma.resume.create({
    data: {
      title: resume_basics.title,
      phoneNumber: resume_basics.phoneNumber,
      email: resume_basics.email,
      website: resume_basics.website,
      location: resume_basics.location,
      summary: resume_basics.summary,
      skills: {
        create: skills
      },
      education: {
        create: {
          institution: education[0].institution,
          degree: education[0].degree,
          field: education[0].field,
          startDate: education[0].startDate,
          endDate: education[0].endDate,

        }

      },
      publications: {
        create: pubs

      }


    }
  }

  )
  if (init_resume) {
    for (let i = 0; i < professionalExperience.length; i++) {
      await prisma.professionalExperience.create({
        data: {
          title: professionalExperience[i].title,
          company: professionalExperience[i].company,
          location: professionalExperience[i].location,
          startDate: professionalExperience[i].startDate,
          endDate: professionalExperience[i].endDate,
          duties: {
            create: professionalExperience[i].duties
          },
          resume: {
            connect: {
              id: init_resume.id
            }
          }
        }

      })

    }
    for (let i = 0; i < education.length; i++) {
      await prisma.education.create({
        data: {
          institution: education[i].institution,
          degree: education[i].degree,
          field: education[i].field,
          startDate: education[i].startDate,
          endDate: education[i].endDate,
          duties: {
            create: education[i].duties

          },
          resume: {
            connect: {
              id: init_resume.id
            }
          },
        }

      })

    }

  }

}
const generateProjects = async () => {
  for (let i = 0; i < projects.length; i++) {
    await prisma.project.create({
      data: {
        title: projects[i].title,
        description: projects[i].description,
        primaryImage: projects[i].primaryImage,
        projectUrl: projects[i].projectUrl,
        githubUrl: projects[i].githubUrl,
        status: projects[i].status,
        features: {
          create: projects[i].features
        },
        technologyStacks: {
          connectOrCreate: projects[i].technologyStacks.map((tech) => {
            return {
              where: { value: tech.value },
              create: { value: tech.value, url: tech.url }
            }
          }
          )

        }
      }
    })

  }
}

 const categoriesToSeed = [
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
