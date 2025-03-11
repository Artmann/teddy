import { memo, ReactElement } from 'react'
import { ResponseHeader } from '@/requests'
import { Badge } from './components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './components/ui/table'

interface ResponseHeadersProps {
  headers: ResponseHeader[]
  statusCode: number
}

export const ResponseHeaders = memo(function ResponseHeaders({
  headers,
  statusCode
}: ResponseHeadersProps): ReactElement {
  return (
    <div className="full relative text-white">
      <div className="absolute top-4 right-4">
        <Badge variant="outline">{statusCode}</Badge>
      </div>

      <div className="full overflow-auto p-6 font-mono">
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
