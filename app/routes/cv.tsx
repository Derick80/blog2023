import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback } from 'react'
import { work_experience } from '~/resources/workexperience'

export default function Cv() {
  return (
    <>
      <div className='items-censter flex flex-col justify-center gap-1 font-Montserrat'>
        {work_experience.map((job, index) => (
          <div
            key={index}
            className='flex flex-col items-stretch gap-2 rounded-md border-2 p-1'
          >
            <h3 className='text-md font-Montserrat'>{job.institution}</h3>
            <AccordianTriggers job={job}>
              <div className='flex flex-col items-start px-4'>
                <ul>
                  {job.duties.map((duty) => (
                    <li className='list-disc text-teal-400' key={duty.id}>
                      <div className='flex flex-row items-center'>
                        <span className='text-xs leading-5 text-slate-900 dark:text-slate-50'>
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
      </div>
    </>
  )
}
type Props = {
  children: React.ReactNode
  job: {
    id: number
    institution: string
    title: string
    period: string
    duties: {
      id: number
      duty: string
    }[]
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

        <div className='flex text-black/50 dark:text-white/50'>
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
