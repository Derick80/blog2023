import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import type { MetaFunction } from '@remix-run/react'
import { Form, Link, json, useLoaderData } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback } from 'react'
import { blurb } from '~/resources/resume/blurb'
import { pubs } from '~/resources/resume/pubs'
import { skills } from '~/resources/resume/skills'
import { work_experience } from '~/resources/resume/workexperience'
import { education } from '~/resources/resume/education'
import { getResume } from '~/server/resume.server'
import EditableTextField from '~/components/editable-text'
import { Label } from '~/components/ui/label'
import { H2, H3 } from '~/components/ui/typography'
import { Button } from '~/components/ui/button'
import { DotIcon } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [
    {
      title: `Derick Hoskinson's Resume`
    }
  ]
}

export async function loader() {
  const resume = await getResume()

  return json({ resume })
}

export async function action() {
  // create a pdf of the resume
}

export default function CVRoute() {
  const { resume } = useLoaderData<typeof loader>()
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const handleAddNewClick = () => {
    setIsAddingNew(true)
  }

  return (
    <Form method='POST' className='flex flex-col justify-center gap-4 p-4'>
      <Label>Title: Name</Label>
      <EditableTextField initialValue={resume?.title} />
      <Label>Phone Number</Label>
      <EditableTextField initialValue={resume?.phoneNumber} />
      <Label>Email</Label>
      <EditableTextField initialValue={resume?.email} />
      <Label>Location</Label>
      <EditableTextField initialValue={resume?.location} />
      <Label>Summary</Label>
      <EditableTextField initialValue={resume?.summary} />
      <H2>Professional Experience</H2>
      <Button type='button' onClick={handleAddNewClick}>
        Add new
      </Button>

      {isAddingNew && (
        <div>
          <Label>Title</Label>
          <EditableTextField />
          <Button type='button' onClick={() => setIsAddingNew(false)}>
            Cancel
          </Button>
        </div>
      )}
      {resume && resume.professionalExperience.length > 0 ? (
        resume?.professionalExperience.map((exp) => (
          <div key={exp.id}>
            <Label className='underline'>Title</Label>
            <EditableTextField initialValue={exp.title} />
            <Label>Company</Label>
            <EditableTextField initialValue={exp.company} />
            <Label>Location</Label>
            <EditableTextField initialValue={exp.location} />
            <Label>Period</Label>
            <div className='flex flex-row gap-2'>
              <EditableTextField initialValue={exp.startDate} />
              -
              <EditableTextField initialValue={exp.endDate} />
            </div>
            <div className='flex flex-col gap-2'>
              <span className='flex flex-row gap-2 items-center justify-between'>
                <H3>Duties</H3>
                <Button type='button' size='sm' onClick={handleAddNewClick}>
                  Add new
                </Button>
              </span>
              {exp.duties && exp.duties.length > 0 ? (
                exp.duties.map((duty) => (
                  <div
                    key={duty.id}
                    className='pl-0 m-0 leading-normal flex items-center'
                  >
                    <DotIcon />
                    <EditableTextField initialValue={duty.description} />
                  </div>
                ))
              ) : (
                <p>No duties added yet</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>
          <p>No professional experience added yet</p>
          <button
            type='button'
            onClick={handleAddNewClick}
            className='text-blue-500'
          >
            Add new
          </button>
        </div>
      )}

      <H2>Skills</H2>

      <H2>Education</H2>
    </Form>
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
