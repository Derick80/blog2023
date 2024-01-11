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
    <div className='relative w-full h-auto'>
      <img src={ imgSrc } { ...props } />
      { imgSrc && <CopyCloudinaryUrl imageUrl={ imgSrc } /> }
      { imgSrc && (<SetPrimaryPostImage imageUrl={ imgSrc } postId={ postId }
        primaryPostImage={ primaryPostImage }
      />

      ) }
      <deleteImageFetcher.Form
        method='POST'
        name='delete-image'
        action='/actions/cloudinary-delete'
      >
        <input type='hidden' name='postId' value={ postId } />
        <input type='hidden' name='imageId' value={ imageId } />
        <input type='hidden' name='publicId' value={ publicId } />
        <Button
          type='submit'
          className='absolute bottom-0 right-0 bg-red-500 text-white p-1 text-xs'
          aria-label='Delete image'
        >
          Delete
        </Button>
      </deleteImageFetcher.Form>
    </div>
  )
}

export default ImageWithPlaceholder
