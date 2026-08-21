import { ApiError } from './ApiError.ts'

type Fetcher = typeof fetch

interface HttpClientOptions {
  baseUrl: string
  fetcher?: Fetcher
}

function parseBody(text: string): unknown {
  if (text.length === 0) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getErrorMessage(body: unknown, status: number): string {
  if (typeof body === 'string' && body.trim().length > 0) {
    return body
  }

  if (body !== null && typeof body === 'object' && 'detail' in body) {
    const detail = body.detail

    if (typeof detail === 'string') {
      return detail
    }
  }

  return `The request failed with status ${status}.`
}

export function createHttpClient({
  baseUrl,
  fetcher = fetch,
}: HttpClientOptions) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')

  return async function request(
    path: string,
    init: RequestInit = {},
  ): Promise<unknown> {
    let response: Response

    try {
      response = await fetcher(`${normalizedBaseUrl}${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...init.headers,
        },
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }

      throw new ApiError('The API could not be reached.', 0, error)
    }

    const body = parseBody(await response.text())

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(body, response.status),
        response.status,
        body,
      )
    }

    return body
  }
}
