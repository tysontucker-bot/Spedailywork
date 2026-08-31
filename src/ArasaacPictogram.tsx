import { useEffect, useState } from 'react'
import { getArasaacImageUrl } from './worksheetData'

interface ArasaacPictogramProps {
  id: number | null
  alt: string
  className?: string
  imageClassName?: string
  emptyMessage: string
  failureMessage: string
  onLoadStateChange?: (failed: boolean) => void
}

export function ArasaacPictogram({
  id,
  alt,
  className,
  imageClassName,
  emptyMessage,
  failureMessage,
  onLoadStateChange,
}: ArasaacPictogramProps) {
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    setLoadFailed(false)
  }, [id])

  useEffect(() => {
    onLoadStateChange?.(loadFailed)
  }, [loadFailed, onLoadStateChange])

  if (!id) {
    return <div className={className}>{emptyMessage}</div>
  }

  if (loadFailed) {
    return <div className={className}>{failureMessage}</div>
  }

  return (
    <div className={className}>
      <img
        alt={alt}
        className={imageClassName}
        onError={() => setLoadFailed(true)}
        src={getArasaacImageUrl(id)}
      />
    </div>
  )
}
