import { describe, expect, it } from 'vitest'

import type { Request } from '@/requests'

import { transformRequestIntoFetchRequest } from './transformers'

describe('transformRequestIntoFetchRequest', () => {
  it('should transform a basic GET request', () => {
    const request: Request = {
      id: 'test-1',
      headers: {},
      method: 'GET',
      url: 'https://api.example.com/users'
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.url).toBe('https://api.example.com/users')
    expect(result.options.method).toBe('GET')
    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client'
    })
    expect(result.options.body).toBeUndefined()
  })

  it('should handle custom headers', () => {
    const request: Request = {
      id: 'test-2',
      headers: {
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      },
      method: 'GET',
      url: 'https://api.example.com/users'
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client',
      Authorization: 'Bearer token123',
      'X-Custom-Header': 'custom-value'
    })
  })

  it('should handle JSON body', () => {
    const request: Request = {
      id: 'test-3',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/users',
      bodyType: 'json',
      body: {
        json: '{"name": "John Doe", "email": "john@example.com"}',
        form: [],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.method).toBe('POST')
    expect(result.options.body).toBe(
      '{"name": "John Doe", "email": "john@example.com"}'
    )
    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client',
      'Content-Type': 'application/json'
    })
  })

  it('should handle GraphQL body', () => {
    const request: Request = {
      id: 'test-4',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/graphql',
      bodyType: 'graphql',
      body: {
        json: '',
        form: [],
        graphql: 'query { users { id name } }'
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.method).toBe('POST')
    expect(result.options.body).toBe(
      JSON.stringify(
        {
          query: 'query { users { id name } }'
        },
        null,
        2
      )
    )
    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client',
      'Content-Type': 'application/json'
    })
  })

  it('should handle form data', () => {
    const request: Request = {
      id: 'test-5',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/login',
      bodyType: 'form',
      body: {
        json: '',
        form: [
          { name: 'username', value: 'john' },
          { name: 'password', value: 'secret123' },
          { name: 'remember', value: 'true' }
        ],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.method).toBe('POST')
    expect(result.options.body).toBe(
      'username=john&password=secret123&remember=true'
    )
    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client'
    })
  })

  it('should handle form data with missing values', () => {
    const request: Request = {
      id: 'test-6',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/login',
      bodyType: 'form',
      body: {
        json: '',
        form: [
          { name: 'username', value: 'john' },
          { name: '', value: 'orphan-value' },
          { name: 'empty', value: '' },
          null as any,
          undefined as any,
          { name: 'password', value: 'secret' }
        ],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.body).toBe('username=john&password=secret')
  })

  it('should handle bodyType none', () => {
    const request: Request = {
      id: 'test-7',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/endpoint',
      bodyType: 'none',
      body: {
        json: '{"should": "be ignored"}',
        form: [],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.body).toBeUndefined()
  })

  it('should handle missing bodyType', () => {
    const request: Request = {
      id: 'test-8',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/endpoint'
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.body).toBeUndefined()
  })

  it('should handle missing body object', () => {
    const request: Request = {
      id: 'test-9',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/endpoint',
      bodyType: 'json'
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.body).toBeUndefined()
  })

  it('should handle DELETE request with JSON body', () => {
    const request: Request = {
      id: 'test-10',
      headers: {},
      method: 'DELETE',
      url: 'https://api.example.com/users/123',
      bodyType: 'json',
      body: {
        json: '{"reason": "User requested deletion"}',
        form: [],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.method).toBe('DELETE')
    expect(result.options.body).toBe('{"reason": "User requested deletion"}')
    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client',
      'Content-Type': 'application/json'
    })
  })

  it('should handle PUT request', () => {
    const request: Request = {
      id: 'test-11',
      headers: {},
      method: 'PUT',
      url: 'https://api.example.com/users/123',
      bodyType: 'json',
      body: {
        json: '{"name": "Updated Name"}',
        form: [],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.method).toBe('PUT')
    expect(result.options.body).toBe('{"name": "Updated Name"}')
  })

  it('should override default headers with custom ones', () => {
    const request: Request = {
      id: 'test-12',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Custom Agent'
      },
      method: 'GET',
      url: 'https://api.example.com/users'
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.headers).toEqual({
      Accept: 'application/json',
      'User-Agent': 'Custom Agent'
    })
  })

  it('should handle empty form array', () => {
    const request: Request = {
      id: 'test-13',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/submit',
      bodyType: 'form',
      body: {
        json: '',
        form: [],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.body).toBe('')
  })

  it('should not add Content-Type header for form data', () => {
    const request: Request = {
      id: 'test-14',
      headers: {},
      method: 'POST',
      url: 'https://api.example.com/upload',
      bodyType: 'form',
      body: {
        json: '',
        form: [{ name: 'field', value: 'value' }],
        graphql: ''
      }
    }

    const result = transformRequestIntoFetchRequest(request)

    expect(result.options.headers).toEqual({
      Accept: '*/*',
      'User-Agent': 'Teddy API Client'
    })
    expect(result.options.headers).not.toHaveProperty('Content-Type')
  })
})
