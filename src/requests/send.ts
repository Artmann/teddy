import { saveSession } from '../sessions'
import { IpcMainInvokeEvent } from 'electron'
import { merge } from 'lodash'

export interface Request {
  body?: string
  headers: Record<string, string>
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}

export interface ResponseHeader {
  name: string
  value: string
}

export interface Response {
  body: string
  headers: ResponseHeader[]
  statusCode: number
}

interface RequestOptions {
  body?: string
  headers: Record<string, string>
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

interface RequestProps {
  url: string
  options?: Partial<RequestOptions>
}

const defaultOptions: RequestOptions = {
  body: undefined,
  headers: {},
  method: 'GET'
}

export async function sendRequest(
  _: IpcMainInvokeEvent,
  props: RequestProps
): Promise<{ error?: string; response?: Response }> {
  const options: RequestOptions = merge({}, defaultOptions, props.options)

  const request = createRequest(props.url, options)

  console.log(`[${request.method}] ${request.url}`)

  try {
    const fetchResponse = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    const body = await fetchResponse.text()

    const headers = transformHeaders(fetchResponse.headers)

    const response: Response = {
      body,
      headers,
      statusCode: fetchResponse.status
    }

    saveSession(request, response)

    return {
      error: undefined,
      response: response
    }
  } catch (e: any) {
    return {
      error: e.message ?? String(e),
      response: undefined
    }
  }
}

function createRequest(url: string, options: RequestOptions): Request {
  return {
    body: options.body,
    headers: options.headers,
    method: options.method,
    url
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