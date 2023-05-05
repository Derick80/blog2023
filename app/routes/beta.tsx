import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
export async function loader({ request, params }: LoaderArgs) {
  const notes = await prisma.note.findMany()
  if (!notes) {
    throw new Error('No notes found')
  }

  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return json({ notes })
}

export default function NotesIndex() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className='text-center text-3xl font-bold text-slate-900 dark:text-slate-50'>
        Notes
      </h1>
      <h3 className='text-center text-2xl font-bold text-slate-900 dark:text-slate-50'>
        <Link to='/beta/new'>New Note</Link>
      </h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {data.notes.map((note) => (
          <div
            className='flex h-fit flex-col justify-around rounded-md border-2 shadow-md drop-shadow-md dark:bg-slate-900  dark:text-slate-50'
            key={note.id}
          >
            <div>
              <h4 className='p-1 dark:text-slate-50'>{note.title}</h4>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
