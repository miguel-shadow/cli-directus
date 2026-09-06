import type {
  HttpCallOptions,
  HttpErrorOptions,
  HttpMethods,
  HttpResponseSuccess,
} from './types.js'


/**
 * Proporciona utilidades HTTP
 */
export const HttpTools = {
  call,
  callSafe,
}


// Opciones por defecto
const DEFAULT_HTTP_ERROR_OPTIONS: Required<HttpErrorOptions> = {
  headers: null,
  method: null,
  statusCode: 0,
}

const DEFAULT_CALL_OPTIONS: Required<HttpCallOptions> = {
  method: 'GET',
  headers: null,
  body: null,
}


/**
 * Error HTTP personalizado.
 *
 * @params message Mensaje de error.
 * @options Opciones:
 *
 * `headers` *{HttpHeaders | null}* - Defaults `null`.
 *
 * `method` *{HttpMethods | null}* - Defaults `null`.
 *
 * `statusCode` *{number}* - Defaults `0`.
 */
export class HttpError extends Error {
  public headers: Headers | null
  public method: HttpMethods | null
  public statusCode: number

  constructor(message: string, options?: HttpErrorOptions) {
    const opts = {
      ...DEFAULT_HTTP_ERROR_OPTIONS,
      ...options,
    }

    super(message)
    this.headers = opts.headers
    this.method = opts.method
    this.statusCode = opts.statusCode
  }
}


/**
 * Realiza una **llamada HTTP**.
 *
 * @param url URL de la petición.
 * @param options Opciones de la llamada:
 *
 * `method`: *{HttpMethods}* - Defaults `'GET'`.
 *
 * `headers`: *{HttpHeaders | null}* - Defaults `null`.
 *
 * `body`: *{unknown}* - Defaults `null`.
 *
 * @returns Respuesta de la llamada.
 */
async function call(url: string | URL, options?: HttpCallOptions): Promise<HttpResponseSuccess> {
  // Default
  const opts: Required<HttpCallOptions> = {
    ...DEFAULT_CALL_OPTIONS,
    ...options,
  }

  // Preparación
  const reqOptions: RequestInit = { method: opts.method }

  // Tipo de body
  if (opts.body !== null) {
    if (opts.body instanceof URLSearchParams || typeof opts.body === 'string') {
      reqOptions.body = opts.body
    } else {
      reqOptions.body = JSON.stringify(opts.body)
    }
  }

  // Headers
  if (opts.headers) {
    reqOptions.headers = opts.headers
  }

  // Llamada
  let res
  try {
    res = await fetch(url, reqOptions)
  } catch (error) {
    throw new HttpError(`Error en la llamada a '${url}': ${error instanceof Error ? error.message : String(error)}`)
  }

  // No exitosa
  if (!res.ok) {
    const resBody = await res.text()

    throw new HttpError(resBody, {
      statusCode: res.status,
      headers: res.headers,
      method: opts.method,
    })
  }

  // Respuesta
  const resBody = await res.text()

  // Respuesta sin body
  if (res.status === 204 || res.status === 205 || !resBody) {
    return {
      type: 'withoutBody',
      statusCode: res.status,
      headers: res.headers,
    }
  }

  // Respuesta con o sin JSON
  try {
    return {
      type: 'json',
      statusCode: res.status,
      headers: res.headers,
      body: JSON.parse(resBody),
    }
  } catch {
    return {
      type: 'text',
      statusCode: res.status,
      headers: res.headers,
      body: resBody,
    }
  }
}


/**
 * Realiza una **llamada HTTP** de manera **segura**, sin lanzar excepciones.
 *
 * @param url URL de la petición.
 * @param options Opciones de la llamada:
 *
 * `method`: *{HttpMethods}* - Defaults `'GET'`.
 *
 * `headers`: *{HttpHeaders | null}* - Defaults `null`.
 *
 * `body`: *{unknown}* - Defaults `null`.
 *
 * @returns Respuesta de la llamada o `null` si se produce un error.
 */
async function callSafe(url: string | URL, options?: HttpCallOptions): Promise<HttpResponseSuccess | null> {
  try {
    return await call(url, options)
  } catch {
    return null
  }
}
