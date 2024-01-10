import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef, useState } from 'react'

export const ImageWithPlaceholder = ({
    src,
    placeholderSrc,
    onLoad,
    ...props
}: {
    onLoad?: () => void
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
    return <img src={ imgSrc } { ...props } />
}

export default ImageWithPlaceholder