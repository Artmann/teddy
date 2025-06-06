import { memo, type ReactElement } from 'react'

export const RequestHeaders = memo(function RequestHeaders(): ReactElement {
  return <div className="flex flex-col full">Request headers</div>
})
