import { ChevronDownIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import type { SerializeFrom } from '@remix-run/node'
import { Form, NavLink, useFetcher, useLoaderData } from '@remix-run/react'
import React from 'react'
import type { Task, TaskCategory } from '~/server/task.server'
import CustomSelectBox from '../custom-select'
import Button from '../../button'
type Props = {
  section: string
}

export default function DocumentationCard({ section }: Props) {
  const data = useLoaderData() as {
    tasks: SerializeFrom<Task[]>
    categories: SerializeFrom<TaskCategory[]>
    sections: string[]
  }

  // filter tasks by section and map over them
  const sectionData = data.tasks.filter((task) => task.section === section)

  return (
    <ul className='m-0 flex w-full flex-col items-start'>
      {sectionData?.map((task) => (
        <TaskList task={task} key={task.id} />
      ))}
    </ul>
  )
}
// Create a list element that displayes the title, description, and status of a task
type TaskListTypes = {
  id: string
  title: string
  description: string
  status: string
  categories: TaskCategory[]
}
function TaskList({ task }: { task: TaskListTypes }) {
  const statusFetcher = useFetcher()

  const [status, setStatus] = React.useState([task.status])

  return (
    <li className='flex w-full flex-col items-start rounded-md p-1 md:p-2 lg:p-3 '>
      <div className='flex w-full scroll-m-10 justify-between gap-1 border-2 text-xl font-bold tracking-tight lg:text-2xl'>
        <p className='text-2xl font-bold tracking-tight lg:text-2xl'>
          {task.title}
        </p>
        <p className='text-2xl font-bold tracking-tight lg:text-2xl'>
          {task.status}
        </p>
      </div>

      <div className='flex w-full justify-between border-2'>
        {task.categories?.map((category) => (
          <p key={category.id}>{category.value}</p>
        ))}
      </div>

      <div className='items-censter flex w-full justify-between border-2'>
        <DescriptionFormatter description={task.description} />
        <div className='flex items-center gap-1'>
          <NavLink to={`/documentation/task/${task.id}/edit`}>
            <Button variant='primary_filled' size='tiny'>
              <Pencil1Icon />
            </Button>
          </NavLink>
          <DeleteTaskForm id={task.id} />
        </div>
      </div>
    </li>
  )
}

function DescriptionFormatter({ description }: { description: string }) {
  const [showMore, setShowMore] = React.useState(false)
  function initialLineClamp(description: string) {
    const descriptionLength = description.length
    if (descriptionLength > 100) {
      return true
    } else {
      return false
    }
  }

  const needsLineClamp = initialLineClamp(description)

  return (
    <>
      {showMore ? (
        <>
          <p className='flex w-fit flex-row items-center indent-2'>
            {description}
          </p>
        </>
      ) : (
        <>
          <p className='line-clamp-1 indent-2'>{description}</p>
        </>
      )}
      {needsLineClamp && (
        <button
          className='flex flex-col items-center justify-center'
          onClick={() => setShowMore(!showMore)}
        >
          <ChevronDownIcon />
        </button>
      )}
    </>
  )
}

// create a delete button that can be used to delete a task
function DeleteTaskForm({ id }: { id: string }) {
  return (
    <Form method='POST' action={`/documentation/task/${id}/delete`}>
      <button type='submit'>
        <TrashIcon />
      </button>
    </Form>
  )
}

// create a Navlink that can be used to edit a task
