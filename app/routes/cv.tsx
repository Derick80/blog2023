import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import type { MetaFunction } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback } from 'react'
import { blurb } from '~/resources/resume/blurb'
import { pubs } from '~/resources/resume/pubs'
import { skills } from '~/resources/resume/skills'
import { work_experience } from '~/resources/resume/workexperience'
import { education } from '~/resources/resume/education'

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick Hoskinson's Resume`
    }
  ]
}

export default function Cv() {
  return (
    <>
      <div className='items-censter flex flex-col justify-center gap-1 font-Montserrat'>
        <div className='flex flex-col gap-1 md:gap-2'>
          <h1>Derick Hoskinson, PhD</h1>
          <h2></h2>
          <p>
            <span className='text-xs'>{blurb.blurb}</span>
          </p>
        </div>

        <h1>Work Experience</h1>

        {work_experience.map((job, index) => (
          <div
            key={index}
            className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
          >
            <h3 className='font-Montserrat'>{job.institution}</h3>
            <AccordianTriggers job={job}>
              <div className='flex flex-col items-start px-4'>
                <ul>
                  {job.duties.map((duty) => (
                    <li className='list-disc text-teal-400' key={duty.id}>
                      <div className='flex flex-row items-center'>
                        <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                          {duty.duty}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordianTriggers>
          </div>
        ))}
        <h1>Publications</h1>
        {pubs.map((pub, index) => (
          <div
            key={index}
            className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
          >
            <h3 className='font-Montserrat'>{pub.title}</h3>

            <AccordianTriggerPub pub={pub}>
              <div className='flex flex-col items-start px-4'>
                <ul>
                  <li className='list-disc text-teal-400' key={pub.id}>
                    <div className='flex flex-row items-center'>
                      {pub.authors.map((author, index) => (
                        <div className='flex flex-col' key={index}>
                          <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                            {author}
                          </span>
                          <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                            {pub.edition}
                            {pub.type}
                          </span>
                          <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                            <Link to={pub.url}>{pub.journal}</Link>
                          </span>
                          <div className='flex'>
                            <span className='text-xs leading-5 text-slate-900 dark:text-violet3'></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            </AccordianTriggerPub>
          </div>
        ))}
        <h1>Education</h1>
        <div className='flex flex-col'>
          {education.map((edu, index) => (
            <div
              key={index}
              className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
            >
              <h3 className='font-Montserrat'>{edu.institution}</h3>
              <div className='flex flex-row items-center justify-between'>
                <h4 className='font-Montserrat'>{edu.degree}</h4>
                <h4 className='font-Montserrat'>
                  {edu.startDate} - {edu.endDate}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col items-stretch gap-1 md:gap-2 rounded-md p-1'>
          <div className='flex flex-col justify-between gap-2 text-xs'>
            <h1>Skills</h1>

            <ul className='flex list-none flex-row flex-wrap gap-2'>
              {skills.map((skill, index) => (
                <li
                  className='t-rounded-md list-none border-2 p-1 text-xs '
                  key={index}
                >
                  <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                    {skill.skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

type Duty = {
  id: number
  duty: string
}
type Props = {
  children: React.ReactNode
  job: {
    id: number
    institution: string
    title: string
    period: string
    duties: Duty[]
  }
}
type PubProps = {
  children: React.ReactNode
  pub: {
    id: string
    title: string
    year: string
    authors: string[]
    journal: string
    edition: string
    type: string
    url: string
    pdf?: string | null | undefined
  }
}

function AccordianTriggers(props: Props) {
  const { children, job } = props

  const [open, setOpen] = React.useState(false)
  const toggleOpen = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  return (
    <div className='flex flex-col rounded-md bg-white/5 '>
      <div className='flex flex-row justify-between gap-2 text-xs'>
        <p className='italic'>{job.title}</p>
        <div className='grow' />

        <div className='flex text-black/50 dark:text-violet3/50'>
          {job.period}
        </div>
        <div className='flex flex-col items-center justify-center pl-4'>
          <button
            type='button'
            onClick={toggleOpen}
            aria-label='Search database'
            className='rounded-md p-2 text-teal-400 transition-all duration-300 hover:backdrop-blur-sm'
          >
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'tween' }}
          >
            <div className='flex flex-col items-stretch'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AccordianTriggerPub(props: PubProps) {
  const { children, pub } = props

  const [open, setOpen] = React.useState(false)
  const toggleOpen = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  return (
    <div className='flex flex-col rounded-md bg-white/5 '>
      <div className='flex flex-row justify-between gap-2 text-xs'>
        <p className='italic'>{pub.journal}</p>
        <div className='grow' />

        <div className='flex text-black/50 dark:text-violet3/50'>
          {pub.year}
        </div>
        <div className='flex flex-col items-center justify-center pl-4'>
          <button
            type='button'
            onClick={toggleOpen}
            aria-label='Search database'
            className='rounded-md p-2 text-teal-400 transition-all duration-300 hover:backdrop-blur-sm'
          >
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'tween' }}
          >
            <div className='flex flex-col items-stretch'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
