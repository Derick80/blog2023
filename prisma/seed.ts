import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { resume_basics,professionalExperience,skills,education,pubs } from '~/resources/resume';
const prisma = new PrismaClient();
import { Project, projects } from '~/resources/projects';
import { TechnologyStack } from '~/server/project.server';



export const categorySeed = [
  { value: "Javascript", label: "Javascript" },
  { value: "React", label: "React" },
  { value: "Node", label: "Node" },
  {
    value: "Typescript",
    label: "Typescript",
  },
  { value: "Next", label: "Next" },
  { value: "Remix", label: "Remix" },
  { value: "Prisma", label: "Prisma" },
  { value: "TailwindCss", label: "TailwindCss" },
  { value: "Cloudinary", label: "Cloudinary" },
  { value: "Postgres", label: "Postgres" },
  { value: "Coding", label: "Coding" },
  { value: "Genetics", label: "Genetics" },
  { value: "Biology", label: "Biology" },
  { value: "Science", label: "Science" },
  { value: "Technology", label: "Technology" },
  { value: "Books", label: "Books" },
  { value: "Travel", label: "Travel" },
  { value: "Music", label: "Music" },
  { value: "Japan", label: "Japan" },
];



async function generateResume () {
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
async function generateMe (environment:string,numberofPosts: number, numberOfUsers: number) {

  if (environment === 'development') {
    await prisma.user.deleteMany()
    await prisma.post.deleteMany()
    await prisma.like.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.resume.deleteMany()
    await prisma.professionalExperience.deleteMany()
    await prisma.education.deleteMany()
    await prisma.publication.deleteMany()
    await prisma.jobSkill.deleteMany()
    await prisma.project.deleteMany()
    await prisma.technologyStack.deleteMany()
  //  remove prior categories
    await prisma.category.deleteMany()
  }

  console.log('Cleaning up the database');


  for (let i = 0; i < categorySeed.length; i++) {
    await prisma.category.create({
      data: categorySeed[i],
    });
  }

  const categories = await prisma.category.findMany()

  const randomCategory = () => {
    const index = Math.floor(Math.random() * categories.length);
    return categories[index];
  }

  // write a function that generates 1-5 random categories for a post
  const generateCategories = () => {
    const numberOfCategories = Math.floor(Math.random() * 5) + 1;
    const cats = [];
    for (let i = 0; i < numberOfCategories; i++) {
      cats.push(randomCategory());
    }
    return cats;
  }

  // write a

  // clean up the database
  const email = (await process.env.SEED_EMAIL) as string;

  await prisma.user
    .delete({
      where: {
        email,
      },
    })
    .catch(() => {
      console.log("No user to delete");
    });
  const hashedPassword = (await process.env.HASHEDPASSWORD) as string;

  const me = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username: "DerickC",
      avatarUrl: `https://res.cloudinary.com/dch-photo/image/upload/v1679953623/p6ii8bxgb3v3n3zpvg0d.webp`,
      role: "ADMIN",

    },
  });

  for (let i = 0; i < numberofPosts; i++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        description: faker.lorem.paragraph(2),
        content: faker.lorem.paragraph(4),
        imageUrl: faker.image.url(),
        published: true,
        categories: {
          connect: generateCategories(),
        },
        user: {
          connect: {
            id: me.id,
          },
        },
      },
    });
  }

  await prisma.profile.create({
    data: {
      user: {
        connect: {
          id: me.id,
        },
      },
      firstName: 'Derick',
      lastName: 'Hoskinson',
      bio: `I am a Senior Clinical Scientist for a large health care + tech company in Chicago IL. Human genetics, data analysis, and the integration of big data into modern web applications is what I stay up at night thinking about.`,
      location: 'Chicago, IL',
      education: 'PhD Genetics, TUfts Graduate School of Biomedical Sciences',
      jobTitle: 'Senior Clinical Scientist',
      employer:'Tempus AI',
      profilePicture: 'https://blogphotosbucket.s3.us-east-2.amazonaws.com/profileimages/DerickFace.jpg',
      email: me.email,
      socials: {
        create: {
          github: 'https://www.github.com/Derick80',
          linkedin: 'https://www.linkedin.com/in/dhoskinson/',
          twitter: 'https://twitter.com/GeneticsStar',
          instagram: 'https://www.instagram.com/thatgrayone/',
          email: me.email
      }
    },
    }
  })


  // generate a unique list of categories from the projects to seed the technologyStacks but I only need the value and url
  type ProjectTechnologyStackPartial = {
    value: string;
    url: string;

}
  const allTechStacks = projects.map((project) => project.categories).flat();

const uniqueCategories = Array.from(new Set(allTechStacks.map(category => category.value))).map(value => {
  const category = allTechStacks.find(category => category.value === value);
  return {
    value,
    url: category?.url || ''
  };
});

  console.log('Unique categories', uniqueCategories);

  // create all technologyStacks

  for (let i = 0; i < uniqueCategories.length; i++) {
    await prisma.technologyStack.create({
      data: uniqueCategories[i],
    });
  }

  const savedTechStacks = await prisma.technologyStack.findMany()



  // write a function that returns 1-5 random categories from the uniqueCategories array and then creates a new project with those technologyStacks

  function getRandomTechStacks() {
    const numberOfTechStacks = Math.floor(Math.random() * 5) + 1;
    const techStacks = [];
    for (let i = 0; i < numberOfTechStacks; i++) {
      techStacks.push(savedTechStacks[i]);
    }
    return techStacks;
  }



  for (let i = 0; i < projects.length; i++) {
    const techStacks = getRandomTechStacks();
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
         connect: techStacks
        },

        user: {
          connect: {
            id: me.id




  }

}
      }
    })
  }






  // create a some new users
  const basePassword = "EGtAUQgz";
  const passwords = await bcrypt.hash(basePassword, 10);

  for (let i = 0; i < numberOfUsers; i++){
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: passwords,
        username: faker.internet.userName(),
        avatarUrl: faker.image.avatar(),
        role: "USER",

      },
    });

    const otherUsers = await prisma.user.findMany({
      where: {
        id: {
          not: me.id,
        }

      },
      select: {
        id: true,

      }
    });


    for (let i = 0; i < otherUsers.length; i++) {
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
          description: faker.lorem.paragraph(1),
          content: faker.lorem.paragraph(4),
          imageUrl: faker.image.url(),
          published: true,
          categories: {
            connect: generateCategories(),
          },
          user: {
            connect: {
              id: otherUsers[i].id,
            },
          },
        },
      });
    }
  }

  // retrieve the posts and users from the database
  // then write a function that takes every user and has them like 1-10 random posts

  const posts = await prisma.post.findMany({
    select: {
      id: true,
    }
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
    }
  });

  // write a function that returns a random post but does not return the same post twice

  const randomPost = () => {
    const index = Math.floor(Math.random() * posts.length);
    return posts[index];
  }
// Combine the randomPost and randomUser functions to create a function that generates a random number of likes for a random post by a random user
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  const numberOfLikes = Math.floor(Math.random() * 10) + 1;

  for (let j = 0; j < numberOfLikes; j++) {
    const post = randomPost();
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: post.id,
        userId: user.id,
      },
    });

    if (!existingLike) {
      await prisma.like.create({
        data: {
          post: {
            connect: { id: post.id },
          },
          user: {
            connect: { id: user.id },
          },
        },
      });
    }
  }
}

  // combine the randomPost and randomUser functions to create a function that generates a random number of likes for a random post by a random user



  // Create comments for each post
  for (let i = 0; i < numberofPosts; i++) {
    const post = await prisma.post.findFirst({
      skip: i,
      take: 1,
    });

    if (post) {
      const numberOfComments = Math.floor(Math.random() * 10) + 1; // Generate a random number of comments
      for (let j = 0; j < numberOfComments; j++) {
        const user = await prisma.user.findFirst(); // Get a random user
        if (user) {
          await prisma.comment.create({
            data: {
              message: faker.lorem.paragraph(), // Generate a random comment message
              user: {
                connect: { id: user.id },
              },
              post: {
                connect: { id: post.id },
              },
            },
          });
        }
      }

    }
    const commentIds = await prisma.comment.findMany({
      select: {
        id: true,
        postId: true,

      }
    });
    const randomComment = () => {
      const index = Math.floor(Math.random() * commentIds.length);
      return commentIds[index];
    }
    // pick 0-5 random commentIds and then create a new comment that replies to that comment
    const numberOfReplies = Math.floor(Math.random() * 5);
    for (let i = 0; i < numberOfReplies; i++) {
      const comment = randomComment();
      const user = await prisma.user.findFirst();
      if (user) {
        await prisma.comment.create({
          data: {
            message: faker.lorem.paragraph(2),
            user: {
              connect: { id: user.id },
            },
            parent: {
              connect: { id: comment.id },
            },
            post: {
              connect: { id: comment.postId },
          },
          },
        });
      }
    }

  }
}

async function seed() {

  await generateMe('development', 5, 5);
  await generateResume();


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
