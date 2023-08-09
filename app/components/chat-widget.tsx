import React from 'react'
import Button from './v3-components/button'
import { Form } from '@remix-run/react'

export default function ChatWidget() {
  const [chatPanelOpen, setChatPanelOpen] = React.useState(false)
  const data = {
    messages: [
      {
        id: 1,
        content: 'Hello',
        userId: 1
      },
      {
        id: 2,
        content: 'Hi',
        userId: 2
      }
    ]
  }

  return chatPanelOpen ? (
    <div className='fixed bottom-10 right-10 h-96 w-96 border-2 bg-white text-gray-500 dark:bg-gray-800'>
      <Button
        onClick={() => setChatPanelOpen(false)}
        variant='primary_filled'
        size='base'
        className='absolute right-2 top-2'
      >
        X
      </Button>
      <ul>
        {data.messages.map(({ content, id, userId }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
      <Form method='POST' className='mt-10'>
        <input
          className='absolute bottom-4 w-full rounded-md border'
          type='text'
          name='content'
        />
        <Button
          variant='primary_filled'
          size='base'
          className='absolute bottom-4 right-4'
        >
          Send
        </Button>
      </Form>
    </div>
  ) : (
    <Button
      onClick={() => setChatPanelOpen(true)}
      variant='primary_filled'
      size='base'
      className='fixed bottom-10 right-10 rounded-lg border-2 px-4 text-gray-700 shadow-lg'
    >
      Chat
    </Button>
  )
}
