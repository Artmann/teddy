import { IpcMainInvokeEvent } from 'electron'
import { merge } from 'lodash'

export interface Response {
  body: string
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

  console.log(`[${options.method}] ${props.url}`)

  try {
    const fetchResponse = await fetch(props.url, {})
    const body = await fetchResponse.text()

    const response = {
      body,
      statusCode: fetchResponse.status
    }

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
