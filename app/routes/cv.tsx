import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import type { MetaFunction } from '@remix-run/react'
import { Link, useLoaderData } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback } from 'react'

import { LoaderFunctionArgs, json } from '@remix-run/node'
import { getCV } from '~/server/cv.server'
import {
  Caption,
  H1,
  H2,
  H3,
  Muted,
  P,
  Small
} from '~/components/ui/typography'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { ArrowUpRightSquare } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
export async function loader({ request }: LoaderFunctionArgs) {
  const cv = await getCV()
  if (!cv) {
    throw new Error('CV not found')
  }
  console.log(cv, 'cv')

  return json({ cv })
}
export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick Hoskinson's Resume`
    }
  ]
}

export async function action() {
  // create a pdf of the resume
}

export default function Cv() {
  const { cv } = useLoaderData<typeof loader>()

  return (
    <div className='flex flex-col justify-center gap-5 font-Montserrat'>
      <div className='flex flex-col gap-1 md:gap-2'>
        <H1>{cv.title}</H1>

        <Muted>{cv.summary}</Muted>
      </div>
      <Accordion
        defaultValue={['professionalExperience', 'publications', 'education']}
        type='multiple'
        className='w-full'
      >
        <AccordionItem value='professionalExperience'>
          <AccordionTrigger>
            <H2>Professional Experience</H2>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col items-stretch gap-2 rounded-md p-1'>
            {cv.professionalExperience.map((job, index) => (
              <Card
                key={job.id}
                className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
              >
                <CardHeader className='ml-0 mr-0 p-0'>
                  <CardTitle>{job.company}</CardTitle>
                </CardHeader>
                <CardDescription className=' flex items-center justify-between'>
                  <Small className='font-Montserrat italic font-bold'>
                    {job.title}
                  </Small>

                  <Small className='font-Montserrat italic font-bold'>
                    {job.startDate} - {job.endDate}
                  </Small>
                </CardDescription>
                <CardContent>
                  <ul className='flex flex-col gap-2 list-disc text-secondary'>
                    {job.duties.map((duty, index) => (
                      <li
                        className='list-disc prose prose-neutral dark:prose-invert'
                        key={duty.id}
                      >
                        {duty.description}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='publications'>
          <AccordionTrigger>
            <H2>Publications</H2>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col items-stretch gap-2 rounded-md p-1'>
            {cv.publications.map((pub) => (
              <Card
                key={pub.id}
                className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
              >
                <CardHeader className='ml-0 mr-0 p-0'>
                  <CardTitle>{pub.title}</CardTitle>
                </CardHeader>
                <CardDescription className=' flex items-center justify-between'>
                  <Small className='font-Montserrat italic font-bold'>
                    {pub.journal}
                  </Small>

                  <Small className='font-Montserrat italic font-bold'>
                    {pub.year}
                  </Small>
                </CardDescription>
                <CardContent className='pl-1 pb-2'>
                  <ul className='flex flex-col gap-2'>
                    <Label>Authors:</Label>

                    <li className='prose prose-neutral dark:prose-invert space-y-2 italic'>
                      <Caption>{pub.authors}</Caption>
                    </li>
                  </ul>
                  <Label className='pl-0'>Article Information:</Label>{' '}
                  <div className='flex flex-row flex-wrap gap-2'>
                    <Caption>{pub.journal}</Caption>
                    <Caption>{pub.year}:</Caption>
                    <Caption>{pub.edition}</Caption>
                    <Caption>{pub.type}</Caption>
                  </div>
                </CardContent>
                <CardFooter className='justify-end'>
                  {pub.pdf && (
                    <Button variant='outline' size='sm' asChild>
                      <Link
                        to={pub.pdf}
                        prefetch='intent'
                        className='text-primary underline'
                      >
                        Download PDF <ArrowUpRightSquare size={16} />
                      </Link>
                    </Button>
                  )}
                  <Button variant='outline' size='sm' asChild>
                    <Link
                      to={pub.url}
                      prefetch='intent'
                      className='text-primary underline'
                    >
                      Read at Journal Web Site <ArrowUpRightSquare size={16} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='education'>
          <AccordionTrigger>
            <H2>Education</H2>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col items-stretch gap-2 rounded-md p-1'>
            {cv.education.map((edu, index) => (
              <Card
                key={edu.id}
                className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
              >
                <CardHeader className='ml-0 mr-0 p-0'>
                  <CardTitle>{edu.degree}</CardTitle>
                </CardHeader>
                <CardDescription className='flex items-center justify-between'>
                  <Small className='font-Montserrat italic font-bold'>
                    {edu.degree}
                  </Small>
                  <Small className='font-Montserrat italic font-bold'>
                    {edu.startDate} - {edu.endDate}
                  </Small>
                </CardDescription>
                <CardContent>
                  <ul className='flex flex-col gap-2 list-disc text-secondary'>
                    {edu.duties.map((duty) => (
                      <li
                        className='list-disc prose prose-neutral dark:prose-invert'
                        key={duty.id}
                      >
                        {duty.description}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className='flex flex-col'></div>
      <div className='flex flex-col items-stretch gap-1 md:gap-2 rounded-md p-1'>
        <div className='flex flex-col justify-between gap-2 text-xs'>
          <H2>Skills</H2>

          <ul className='flex list-none flex-row flex-wrap gap-2'>
            {cv.skills.map((skill, index) => (
              <li
                className='t-rounded-md list-none border-2 p-1 text-xs '
                key={skill.id}
              >
                <span className='text-xs leading-5 '>{skill.skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
