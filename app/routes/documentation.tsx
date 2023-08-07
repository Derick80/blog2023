import type { LoaderArgs } from '@remix-run/node'
import { json, SerializeFrom } from '@remix-run/node'
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import DocumentationCard from '~/components/documentation/doc-component'
import { getTaskCategories, getTasks } from '~/server/task.server'
import SearchBar from '~/components/search-bar'
import { Prisma } from '@prisma/client'
import { prisma } from '~/server/auth/prisma.server'
import CustonSelect from '~/components/customselect'
export async function loader({ request, params }: LoaderArgs) {
  const url = new URL(request.url)

  const filter = url.searchParams.get('filter')
  console.log('filter', filter)
  let textFilter: Prisma.TaskWhereInput = {}
  if (filter) {
    textFilter = {
      OR: [
        { title: { contains: filter, mode: 'insensitive' } },
        { description: { contains: filter, mode: 'insensitive' } },
        { section: { contains: filter, mode: 'insensitive' } },
        { status: { contains: filter, mode: 'insensitive' } }
      ]
    }
  }
  const categories = await getTaskCategories()
  const tasks = await prisma.task.findMany({
    where: textFilter,
    include: {
      categories: true
    }
  })

  // get unique sections from tasks array
  const sections = tasks ? [...new Set(tasks.map((task) => task.section))] : []

  const statusSelectOptions = tasks
    ? [...new Set(tasks.map((task) => task.status))]
    : []

  const SelectOptions = statusSelectOptions.map((option) => {
    return { value: option, label: option }
  })

  return json({ tasks, categories, sections, SelectOptions })
}

export default function DocumentationIndex() {
  const data = useLoaderData<typeof loader>()

  const user = useOptionalUser()

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className='flex flex-col items-center justify-center'>
      {isAdmin && (
        <div className='mb-5 flex h-16 w-full items-center justify-center border-2'></div>
      )}
      <div className='flex h-full w-1/2 items-center justify-center border-2'></div>
      <div className='flex h-full w-1/2 items-center justify-center border-2'>
        <SearchBar appRoute='/documentation' />
      </div>

      {data.sections.map((section) => (
        <div
          className='flex w-full flex-col items-center justify-center border-2'
          key={section}
        >
          <h3 className='text-2xl font-bold tracking-tight lg:text-2xl'>
            {section}
          </h3>
          <DocumentationCard section={section} />
        </div>
      ))}

      <Outlet />
    </div>
  )
}
