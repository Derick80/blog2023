import { prisma } from '~/.server/prisma.server';
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




  await generateResume();

  await generateProjects();

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
