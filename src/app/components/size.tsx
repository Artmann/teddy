import type { ReactElement } from 'react'

export function Size({ sizeInBytes }: { sizeInBytes: number }): ReactElement {
  if (sizeInBytes < 1024) {
    return <>{sizeInBytes} bytes</>
  }

  if (sizeInBytes < 1024 * 1024) {
    const kb = (sizeInBytes / 1024).toFixed(2)

    return <>{kb} KB</>
  }

  const mb = (sizeInBytes / (1024 * 1024)).toFixed(2)

  return <>{mb} MB</>
}
