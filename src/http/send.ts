import type { IpcMainInvokeEvent } from 'electron'

import { transformRequestIntoFetchRequest } from './transformers'

import type { Request } from '@/requests'

export interface ResponseHeader {
  name: string
  value: string
}

export interface Response {
  body: string
  headers: ResponseHeader[]
  statusCode: number
  sizeInBytes: number
}

interface RequestProps {
  request: Request
}

export async function sendRequest(
  _: IpcMainInvokeEvent,
  props: RequestProps
): Promise<{ error?: string; response?: Response }> {
  const { url, options } = transformRequestIntoFetchRequest(props.request)

  console.log('Sending request to', url, 'with options:', options)

  try {
    const fetchResponse = await fetch(url, options)

    const body = await fetchResponse.text()

    const headers = transformHeaders(fetchResponse.headers)

    const contentLengthHeader = fetchResponse.headers.get('content-length')
    const sizeInBytes = contentLengthHeader
      ? parseInt(contentLengthHeader, 10)
      : new Blob([body]).size

    const response: Response = {
      body,
      headers,
      sizeInBytes,
      statusCode: fetchResponse.status
    }

    console.log('Received response:', response)

    return {
      error: undefined,
      response: response
    }
  } catch (e: any) {
    console.log('Failed to send the request:', e)
    return {
      error: e.message ?? String(e),
      response: undefined
    }
  }
}

function transformHeaders(responseHeaders?: Headers): ResponseHeader[] {
  if (!responseHeaders) {
    return []
  }

  const headers = [...responseHeaders.entries()].map(([key, value]) => ({
    name: key,
    value
  }))

  return headers
}
