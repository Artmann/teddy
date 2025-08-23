import { memo, ReactElement, useContext } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { CodeEditor } from '../ui/code-editor'
import { SessionContext } from '@/sessions'

interface RequestBodyProps {
  onSubmit?: () => void
}

export const RequestBody = memo(function RequestBody({ onSubmit }: RequestBodyProps): ReactElement {
  const { selectedRequest, updateRequest } = useContext(SessionContext)

  const bodyType = selectedRequest.bodyType || 'none'
  const bodyContent = selectedRequest.body?.[bodyType] || ''

  console.log({ bodyContent, bodyType, selectedRequest })

  const handleBodyTypeChange = (
    newBodyType: 'none' | 'json' | 'graphql' | 'form'
  ) => {
    updateRequest(selectedRequest.id, {
      bodyType: newBodyType
    })
  }

  const handleBodyContentChange = (newContent: string) => {
    updateRequest(selectedRequest.id, {
      body: {
        ...(selectedRequest.body || {}),
        [bodyType]: newContent
      }
    })
  }

  const renderBodyEditor = () => {
    if (bodyType === 'none') {
      return (
        <div className="w-full flex-1 min-h-0 flex items-center justify-center text-muted-foreground text-sm">
          No body selected
        </div>
      )
    }

    if (bodyType === 'form') {
      return (
        <div className="w-full flex-1 min-h-0 flex items-center justify-center text-muted-foreground text-sm">
          Form editor coming soon
        </div>
      )
    }

    return (
      <CodeEditor
        value={bodyContent}
        onChange={handleBodyContentChange}
        language={bodyType === 'graphql' ? 'graphql' : 'json'}
        placeholder={
          bodyType === 'json' ? '{\n  "key": "value"\n}' : 'query {\n  field\n}'
        }
        className="w-full flex-1 min-h-0"
        onSubmit={onSubmit}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex-1 min-h-0">{renderBodyEditor()}</div>
      <div className="pt-2">
        <Select
          value={bodyType}
          onValueChange={handleBodyTypeChange}
        >
          <SelectTrigger className="w-28 text-xs">
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className="text-xs"
              value="none"
            >
              No body
            </SelectItem>
            <SelectItem
              className="text-xs"
              value="json"
            >
              JSON
            </SelectItem>
            <SelectItem
              className="text-xs"
              value="graphql"
            >
              GraphQL
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
})
