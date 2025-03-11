import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import { memo, ReactElement, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from './components/ui/button'
import { Form, FormControl, FormField, FormItem } from './components/ui/form'
import { Input } from './components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Response } from '../requests'
import { ResponseContent } from './response-content'
import { ResponseHeaders } from './response-headers'

interface FormData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}

export const ApiClient = memo(function ApiClient(): ReactElement {
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [response, setResponse] = useState<Response | undefined>(
    window.session.lastResponse
  )
  const [requestError, setRequestError] = useState<string>()

  console.log({ response })

  const form = useForm<FormData>({
    defaultValues: {
      method: window.session.lastRequest?.method || 'GET',
      url:
        window.session.lastRequest?.url ||
        'https://jsonplaceholder.typicode.com/posts/1'
    }
  })

  const handleSubmit = useCallback(async (data: FormData) => {
    console.log(data)

    setIsSendingRequest(true)
    setRequestError(undefined)

    try {
      const { response, error } = await window.api.invoke.sendRequest({
        url: data.url,
        options: {
          method: data.method
        }
      })

      setResponse(response)
      setRequestError(error)
    } catch (error: any) {
      setRequestError(error.message ?? String(error))
    } finally {
      setIsSendingRequest(false)
    }
  }, [])

  return (
    <Form {...form}>
      <form
        aria-disabled={isSendingRequest}
        className="full flex flex-col"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div>
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
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
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoFocus={true}
                        className="text-white border-white focus-visible:border-white"
                        disabled={isSendingRequest}
                        type="url"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
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
            {requestError ? `Error: ${requestError}` : ' '}
          </div>
        </div>

        <div className="p-4 flex flex-1 min-h-0">
          <div className="w-1/2 h-full">Request</div>
          <motion.div
            className="h-full"
            initial={{ width: '0%' }}
            animate={{
              width: response ? '50%' : '0%'
            }}
          >
            {response ? (
              <Tabs
                defaultValue="content"
                className="full"
              >
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="m-0 full"
                  value="content"
                >
                  <ResponseContent
                    content={response.body ?? ''}
                    statusCode={response.statusCode}
                  />
                </TabsContent>
                <TabsContent
                  className="m-0 full"
                  value="headers"
                >
                  <ResponseHeaders
                    headers={response.headers}
                    statusCode={response.statusCode}
                  />
                </TabsContent>
              </Tabs>
            ) : null}
          </motion.div>
        </div>
      </form>
    </Form>
  )
})
