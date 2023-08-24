/* eslint-disable react/display-name */
import * as Accordion from '@radix-ui/react-accordion'
import {
  ChevronDownIcon,
  GitHubLogoIcon,
  OpenInNewWindowIcon
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import React from 'react'
import type { Implementation, Project } from '~/resources/projects'
import { Link } from '@remix-run/react'
import ToolTip from '../tooltip-v2'
import TechnologiesContainer from './project-tech-container'
import { getUniqueCategories } from '~/utilities'

// create props for the accordion that can take either a single array of titles for each section or an array of objects with a title and content

type AccordianProps = {
  projects: Project
}
export default function ProjectAccordian({ projects }: AccordianProps) {
  return (
    <Accordion.Root
      className='w-full rounded-md bg-violet1 shadow-[0_2px_10px] shadow-black/5'
      type='multiple'
    >
      <AccordionItem
        value={projects.id}
        className='border-[1px] border-b border-violet4'
      >
        <AccordionTrigger>{projects.title}</AccordionTrigger>
        <AccordionContent>
          <ProjectDetails project={projects} />
        </AccordionContent>
      </AccordionItem>
    </Accordion.Root>
  )
}

type AccordianItemProps = {
  children: React.ReactNode
  className?: string
  value?: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordianItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      value='item-1'
      className={clsx(
        'focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
)

type AccordianTriggerProps = {
  children: React.ReactNode
  className?: string
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordianTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className='flex'>
    <Accordion.Trigger
      className={clsx(
        'hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none text-violet12 shadow-[0_1px_0] shadow-violet6 outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className='text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180'
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
))

type AccordionContentProps = {
  children: React.ReactNode
  className?: string
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={clsx(
      'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden bg-violet1 text-[15px] text-black dark:bg-violet3_dark  dark:text-violet3',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className='px-5 py-[15px]'>{children}</div>
  </Accordion.Content>
))

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-base'>Description</h3>
      <p className='text-sm'>{project.description}</p>
      <h3 className='text-base'>Implementations</h3>
      <ul className='flex flex-col items-start px-4'>
        {project?.implementations?.map((implementation: Implementation) => (
          <li className='list-disc text-teal-400' key={implementation.id}>
            <div className='flex flex-row items-center'>
              <span className='text-xs leading-5 text-slate-900 dark:text-violet3'>
                {implementation.task}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <h3 className='text-base'>Technologies</h3>
      <TechnologiesContainer categories={project.categories} />

      <h3 className='text-base'>Project code and Github</h3>
      <div className='flex flex-row items-center gap-2'>
        <ToolTip tip='Link to the Github repo'>
          <Link
            title='Link to my github repo for this project'
            to={project.githubUrl}
            referrerPolicy='no-referrer'
            target='_blank'
          >
            <GitHubLogoIcon />
          </Link>
        </ToolTip>
        <div className='flex-1' />
        {project.status !== 'Abandoned' && (
          <>
            <ToolTip tip='Link to the live project'>
              <Link
                title='Link to the live project'
                to={project.projectUrl}
                referrerPolicy='no-referrer'
                target='_blank'
              >
                <OpenInNewWindowIcon />
              </Link>
            </ToolTip>
          </>
        )}
      </div>
    </div>
  )
}
