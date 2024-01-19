import { useFetcher } from '@remix-run/react'
import React, {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button } from '../ui/button'
import { CopyCloudinaryUrl } from './copy-image-url'
import { SetPrimaryPostImage } from './set-primary-post-image'
import { TrashIcon } from '@radix-ui/react-icons'

export const ImageWithPlaceholder = ({
  primaryPostImage,
  src,
  placeholderSrc,
  publicId,
  imageId,
  postId,
  onLoad,
  ...props
}: {
  onLoad?: () => void
  primaryPostImage?: string
  publicId: string
  imageId: string
  postId: string
  placeholderSrc?: string
} & DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  const [imgSrc, setImgSrc] = React.useState(placeholderSrc || src)
  // Store the onLoad prop in a ref to stop new Image() from re-running
  const onLoadRef = useRef<(() => void) | undefined>(onLoad)
  useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgSrc(src)
      if (onLoadRef.current) {
        onLoadRef.current()
      }
    }
    img.src = src
  }, [src])

  const deleteImageFetcher = useFetcher()

  return (
    <div className='group relative mt-2 h-20 w-20 rounded-lg border border-purple-500 overflow-y-auto'>
      <img src={imgSrc} {...props} className='rounded-lg' />
      {imgSrc && <CopyCloudinaryUrl imageUrl={imgSrc} />}
      {imgSrc && (
        <SetPrimaryPostImage
          imageUrl={imgSrc}
          postId={postId}
          primaryPostImage={primaryPostImage}
        />
      )}
      <deleteImageFetcher.Form
        method='POST'
        name='delete-image'
        action='/actions/cloudinary_v2'
      >
        <input type='hidden' name='postId' value={postId} />
        <input type='hidden' name='imageId' value={imageId} />
        <input type='hidden' name='publicId' value={publicId} />
        <Button
          type='submit'
          size='icon'
          variant='ghost'
          name='intent'
          value='deleteImage'
          className='absolute bottom-0 right-0 '
          aria-label='Delete image'
        >
          <TrashIcon className='block h-3 w-3 bg-red' />
        </Button>
      </deleteImageFetcher.Form>
    </div>
  )
}

export function useObjectUrls() {
  const mapRef = useRef<Map<File, string> | null>(null)
  useEffect(() => {
    const map = new Map()
    mapRef.current = map
    return () => {
      for (let [file, url] of map) {
        URL.revokeObjectURL(url)
      }
      mapRef.current = null
    }
  }, [])
  return function getObjectUrl(file: File) {
    const map = mapRef.current
    if (!map) {
      throw Error('Cannot getObjectUrl while unmounted')
    }
    if (!map.has(file)) {
      const url = URL.createObjectURL(file)
      map.set(file, url)
    }
    const url = map.get(file)
    if (!url) {
      throw Error('Object url not found')
    }
    return url
  }
}
