import { useFetcher } from '@remix-run/react'
import React from 'react'
import { Button } from '~/components/ui/button'

export default function ImageUploader ({
  setUrl,
  preview = true
}: {
  setUrl: React.Dispatch<React.SetStateAction<string>>
  preview?: Boolean
}) {
  // figure out a way to disable the button if the file is not selected
  const [readyToUpload, setReadyToUpload] = React.useState(false)
  const fetcher = useFetcher()

  const onChange = async () => {
    fetcher.submit({
      imageUrl: 'imageUrl',
      key: 'imageUrl',
      action: '/actions/cloudinary'
    })
    setReadyToUpload(true)
  }
  return (
    <>
      <fetcher.Form
        method='POST'
        encType='multipart/form-data'
        action='/actions/cloudinary'
        onChange={ onChange }
        className='flex flex-row items-center gap-2'
      >
        <label htmlFor='imageUrl' className='subtitle'></label>
        <input
          id='imageUrl'
          className=' block w-full cursor-pointer rounded-xl border-2 p-2 text-xs '
          type='file'
          name='imageUrl'
          accept='image/*'
        />
        <Button disabled={ !readyToUpload } variant='default' type='submit'>
          Upload
        </Button>
      </fetcher.Form>
      { preview && fetcher.data ? (
        <div className='mx-auto flex h-fit w-12 flex-row items-center '>
          <input
            type='hidden'
            name='imageUrl'
            onChange={ void setUrl(fetcher?.data.imageUrl) }
          />
          { fetcher.data.imageUrl && (
            <img
              src={ fetcher?.data?.imageUrl }
              alt={ 'no' }
              className='h-full w-full object-cover'
            />
          ) }
        </div>
      ) : null }
    </>
  )
}
