import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { useOptionalUser } from '~/utilities'
import DocumentationCard from '~/components/doc-component'
import { getDocumentation } from '~/server/auth/documentation.server'
export async function loader({ request, params }: LoaderArgs) {
  // const sectionDocumentationDatas = sectionDocumentationData

  // const groupedData: { [key: string]: SectionDocumentation } =
  //   sectionDocumentationData.reduce(
  //     (acc, sectionDoc) => {
  //       if (acc[sectionDoc.section]) {
  //         acc[sectionDoc.section].tasks.push(...sectionDoc.tasks)
  //       } else {
  //         acc[sectionDoc.section] = {
  //           ...sectionDoc,
  //           tasks: [...sectionDoc.tasks]
  //         }
  //       }
  //       return acc
  //     },
  //     {} as {
  //       [key: string]: SectionDocumentation
  //     }
  //   )

  // const groupedSections: SectionDocumentation[] = Object.entries(
  //   groupedData
  // ).map(([_, value]) => value)
  // console.log(groupedSections.length, 'groupedSections')

  const sectionDocumentationData = await getDocumentation()
  const sectionDocumentationDatas = Object.entries(
    sectionDocumentationData
  ).map(([_, value]) => value)

  return json({ sectionDocumentationDatas })
}

export default function DocumentationIndex() {
  const data = useLoaderData<typeof loader>()
  console.log(data, 'data')

  const user = useOptionalUser()
  console.log(user, 'user')

  const isAdmin = user?.role === 'ADMIN'

  const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))

  const [open, setOpen] = React.useState(false)

  return (
    <div className='flex flex-col items-center justify-center'>
      {isAdmin && (
        <div className='flex h-16 w-full items-center justify-center border-2'>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>New Section</Dialog.Trigger>
            <Dialog.Overlay />
            <Dialog.Content>
              <Form
                onSubmit={(event) => {
                  wait().then(() => setOpen(false))
                  event.preventDefault()
                }}
              >
                <label>
                  <span>title</span>
                  <input type='text' name='title' />
                </label>
                <button type='submit'>Submit</button>
              </Form>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      )}
      {data.sectionDocumentationDatas.map((section) => (
        <DocumentationCard section={section.section} key={section.id} />
      ))}
      {/* <Outlet /> */}
    </div>
  )
}
