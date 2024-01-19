// ConfirmationDialog.tsx

import React from 'react'
import { Button } from '~/components/ui/button'

interface ConfirmationDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationDialog ({
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur'>
      <div className='bg-white p-4 rounded-md shadow-md'>
        <h2 className='text-lg text-black font-semibold mb-2'>{ title }</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>{ message }</p>
        <div className='mt-4 flex justify-end space-x-2'>
          <Button variant='destructive' onClick={ onCancel }>
            Cancel
          </Button>
          <Button variant='destructive' onClick={ onConfirm }>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
