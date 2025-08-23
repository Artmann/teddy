import type { Request } from '@/requests'

export function transformRequestIntoFetchRequest(request: Request): {
  url: string
  options: RequestInit
} {
  const body = getEncodedBody(request)

  const headers = {
    ...getPrefilledHeaders(request),
    ...request.headers
  }

  const options: RequestInit = {
    body,
    headers,
    method: request.method ?? 'GET'
  }

  return { url: request.url, options }
}

function getEncodedBody(request: Request): string | undefined {
  if (!request.bodyType || !request.body) {
    return
  }

  if (request.bodyType === 'none') {
    return
  }

  if (request.bodyType === 'json') {
    return request.body.json
  }

  if (request.bodyType === 'graphql') {
    return JSON.stringify({ query: request.body.graphql }, null, 2)
  }

  if (request.bodyType === 'form') {
    return new URLSearchParams(
      request.body.form.reduce(
        (acc, item) => {
          if (item?.name && item?.value) {
            acc[item.name] = item.value
          }
          return acc
        },
        {} as Record<string, string>
      )
    ).toString()
  }
}

function getPrefilledHeaders(request: Request): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: '*/*',
    'User-Agent': 'Teddy API Client'
  }

  if (
    request.bodyType &&
    ['json', 'graphql'].includes(request.bodyType.toLowerCase())
  ) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}
