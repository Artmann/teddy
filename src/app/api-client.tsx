import { LoaderCircle, SendIcon } from 'lucide-react'
import {
  memo,
  type ReactElement,
  useCallback,
  useContext,
  useState
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { ResponseContent } from './components/response-tabs/response-content'
import { ResponseHeaders } from './components/response-tabs/response-headers'
import { SessionContext } from '@/sessions'
import { RequestBody } from './components/request-tabs/request-body'
import { RequestAuth } from './components/request-tabs/request-auth'
import { RequestHeaders } from './components/request-tabs/request-headers'
import { RequestParams } from './components/request-tabs/request-params'
import { Badge } from './components/ui/badge'
import { Size } from './components/size'

export const ApiClient = memo(function ApiClient(): ReactElement {
  const { selectedRequest, updateRequest, updateResponse } =
    useContext(SessionContext)

  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [requestError, setRequestError] = useState<string>()

  const response = selectedRequest.response

  const handleChangeMethod = (newMethod: string) => {
    updateRequest(selectedRequest.id, { method: newMethod as any })
  }

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRequest(selectedRequest.id, { url: e.target.value })
  }

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()

      if (isSendingRequest) {
        return
      }

      console.log('Sending a request', selectedRequest)

      setIsSendingRequest(true)
      setRequestError(undefined)

      try {
        const { response, error } = await window.api.invoke.sendRequest({
          request: selectedRequest
        })

        updateResponse(selectedRequest.id, response)

        setRequestError(error)
      } catch (error: any) {
        console.error(error)

        setRequestError(error.message ?? String(error))
      } finally {
        setIsSendingRequest(false)
      }
    },
    [selectedRequest, updateResponse, isSendingRequest]
  )

  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  // Global Cmd+Enter (Mac) / Ctrl+Enter (Windows/Linux) handler
  useHotkeys(
    'mod+enter',
    (e) => {
      e.preventDefault()
      handleSubmit()
    },
    {
      enabled: !isSendingRequest
    }
  )

  return (
    <form
      aria-disabled={isSendingRequest}
      className="full flex flex-col"
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div className="p-4 flex flex-col gap-2 border-border border-b">
        <div className="flex items-center gap-2">
          <div>
            <Select
              value={selectedRequest.method}
              onValueChange={handleChangeMethod}
            >
              <SelectTrigger className="w-[128px] text-white border-white">
                <SelectValue placeholder="GET" />
              </SelectTrigger>
              <SelectContent className="bg-[#282C34] text-white border-white">
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                <SelectItem value="TRACE">TRACE</SelectItem>
                <SelectItem value="CONNECT">CONNECT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              autoFocus={true}
              className="text-white border-white focus-visible:border-white"
              data-testid="url-input"
              disabled={isSendingRequest}
              type="url"
              value={selectedRequest.url}
              onChange={handleChangeUrl}
              onKeyDown={handleUrlKeyDown}
            />
          </div>
          <div>
            <Button
              className="w-32"
              disabled={isSendingRequest}
              type="submit"
              variant="outline"
            >
              {isSendingRequest ? (
                <>
                  <LoaderCircle className="block size-6 animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
        <div className="font-mono text-xs text-red-700">
          {requestError ? `Error: 2 ${requestError}` : ' '}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Request */}
        <div className="w-1/2 h-full p-4 flex flex-col">
          <Tabs
            defaultValue="body"
            className="flex flex-col h-full"
          >
            <TabsList className="shrink-0">
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="params">Params</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent
              className="m-0 flex-1 min-h-0 py-4"
              value="body"
            >
              <RequestBody onSubmit={handleSubmit} />
            </TabsContent>

            <TabsContent
              className="m-0 flex-1 min-h-0 py-4"
              value="params"
            >
              <RequestParams />
            </TabsContent>

            <TabsContent
              className="m-0 flex-1 min-h-0 py-4"
              value="auth"
            >
              <RequestAuth />
            </TabsContent>

            <TabsContent
              className="m-0 flex-1 min-h-0 py-4"
              value="headers"
            >
              <RequestHeaders />
            </TabsContent>
          </Tabs>
        </div>

        {/* Response */}
        <div className="w-1/2 h-full border-border border-l p-4">
          {response ? (
            <div className="full flex flex-col gap-4">
              <div className="flex-1 min-h-0">
                <Tabs
                  defaultValue="content"
                  className="full"
                >
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="m-0 full py-4"
                    value="content"
                  >
                    <ResponseContent
                      content={response.body ?? ''}
                      statusCode={response.statusCode}
                    />
                  </TabsContent>
                  <TabsContent
                    className="m-0 full py-4"
                    value="headers"
                  >
                    <ResponseHeaders
                      headers={response.headers}
                      statusCode={response.statusCode}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex gap-4 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#A6DA95]" />

                  <div>
                    <span data-testid="response-status-code">
                      {response.statusCode}
                    </span>{' '}
                    OK
                  </div>
                </div>

                <Badge
                  variant="muted"
                  data-testid="response-time"
                >
                  {response.responseTimeInMilliseconds}ms
                </Badge>

                <Badge
                  variant="muted"
                  data-testid="response-size"
                >
                  <Size sizeInBytes={response.sizeInBytes} />
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <SendIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Send a request to see the response.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
})
