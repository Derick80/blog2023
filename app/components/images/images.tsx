import { useFetcher } from '@remix-run/react'
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef, useState } from 'react'

export const ImageWithPlaceholder = ({
    src,
    placeholderSrc,
    publicId,
    imageId,
    postId,
    onLoad,
    ...props
}: {
    onLoad?: () => void
    publicId: string
    imageId: string
    postId: string
    placeholderSrc?: string
} & DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
>) => {
    const [imgSrc, setImgSrc] = useState(
        placeholderSrc || src,
    )
    // Store the onLoad prop in a ref to stop new Image() from re-running
    const onLoadRef = useRef(onLoad)
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


    return (<div className="relative w-full h-auto">

        <img src={ imgSrc } { ...props } />
        <deleteImageFetcher.Form method="POST" action="/actions/cloudinary-delete"
        >
            <input type="hidden" name="postId" value={ postId } />
            <input type="hidden" name="imageId" value={ imageId } />
            <input type="hidden" name="publicId" value={ publicId } />
            <button
                type="submit"
                className="absolute bottom-0 right-0 bg-red-500 text-white p-1 text-xs"
                aria-label="Delete image"
                onClick={ () => console.log('delete image') }
            >
                Delete
            </button>
        </deleteImageFetcher.Form>
    </div>
    )
}

export default ImageWithPlaceholder