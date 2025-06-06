import { memo, ReactElement } from 'react'

import { ResponseHeader } from '@/http'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'

interface ResponseHeadersProps {
  headers: ResponseHeader[]
  statusCode: number
}

export const ResponseHeaders = memo(function ResponseHeaders({
  headers
}: ResponseHeadersProps): ReactElement {
  return (
    <div className="full relative text-white">
      <div className="full overflow-auto font-mono">
        {headers.length === 0 ? (
          <div className="italic">No headers</div>
        ) : (
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headers.map((header, index) => (
                <TableRow key={`${header.name}-${index}`}>
                  <TableCell className="whitespace-nowrap">
                    {header.name}
                  </TableCell>
                  <TableCell className="break-all">{header.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
})
