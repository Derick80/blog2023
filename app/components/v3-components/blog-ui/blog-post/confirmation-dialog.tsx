// ConfirmationDialog.tsx

import React from 'react'

interface ConfirmationDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationDialog({
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur'>
      <div className='bg-white p-4 rounded-md shadow-md'>
        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
        <p>{message}</p>
        <div className='mt-4 flex justify-end space-x-2'>
          <button
            className='px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className='px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
