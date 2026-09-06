export type HttpMethods = 'DELETE' |
  'GET' |
  'OPTIONS' |
  'PATCH' |
  'POST' |
  'PUT'


interface HttpResponse {
  headers: Headers
  statusCode: number
  type: string
}

interface HttpResponseWithText extends HttpResponse {
  body: string
  type: 'text'
}

interface HttpResponseWithJson extends HttpResponse {
  body: unknown
  type: 'json'
}

interface HttpResponseWithoutBody extends HttpResponse {
  type: 'withoutBody'
}

export type HttpResponseSuccess = HttpResponseWithText | HttpResponseWithJson | HttpResponseWithoutBody


export interface HttpErrorOptions {
  headers?: Headers | null
  method?: HttpMethods | null
  statusCode?: number
}


export interface HttpCallOptions {
  body?: unknown
  headers?: Record<string, string> | null
  method?: HttpMethods
}
