import { HttpError, HttpTools, type HttpMethods } from '@tools'
import type { DirectusEnv, DirectusEnvData } from '@services'
import type { DirectusHeaders } from './types.js'


export class DirectusApiError extends Error {}


export class DirectusApi {
  private _directusEnvData: DirectusEnvData | null = null
  private directusEnv: DirectusEnv


  constructor(directusEnv: DirectusEnv) {
    this.directusEnv = directusEnv
    this.directusEnvData = directusEnv.getCurrent()
  }


  public get directusEnvData(): DirectusEnvData {
    if (this._directusEnvData === null) {
      throw new DirectusApiError('No existe un entorno de Directus activo válido en la carpeta actual')
    }

    return this._directusEnvData
  }

  public set directusEnvData(data: DirectusEnvData | null) {
    this._directusEnvData = data
  }

  private getheaders(withJson: boolean = false): DirectusHeaders {
    const headers: DirectusHeaders = {
      Authorization: `Bearer ${this.directusEnvData.token}`,
    }

    if (withJson) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  private processErrors(error: unknown): void {
    if (error instanceof HttpError) {
      if (error.statusCode === 401) {
        throw new DirectusApiError('Credenciales de Directus inválidas')
      } else if (error.statusCode === 403) {
        throw new DirectusApiError('No tienes acceso al recurso en Directus')
      }
    }

    throw error
  }

  public async checkConnection(): Promise<void> {
    const url = `${this.directusEnvData.url}/users/me`

    try {
      await HttpTools.call(url, {
        headers: this.getheaders(),
      })
    } catch (e) {
      this.processErrors(e)
    }
  }

  /**
   * Realiza una petición a Directus mediante API para recuperar dat.a
   *
   * @param path Path de la petición, el path debe comenzar por `/`.
   *
   * @return data obtenida
   */
  public async getData(path: string): Promise<unknown> {
    const url = `${this.directusEnvData.url}${path}`

    try {
      const result = await HttpTools.call(url, {
        headers: this.getheaders(),
      })

      if (result.type === 'json') {
        return result.body
      }
    } catch (e) {
      this.processErrors(e)
    }

    throw new Error('No se ha podido obtener datos de la petición')
  }

  /**
   * Realiza una petición a Directus mediante API para enviar data.
   *
   * @param path Path de la petición, el path debe comenzar por `/`.
   *
   * @return data obtenida
   */
  public async sendData(path: string, method: HttpMethods, data: unknown): Promise<unknown> {
    const url = `${this.directusEnvData.url}${path}`

    try {
      const result = await HttpTools.call(url, {
        headers: this.getheaders(true),
        body: data,
        method,
      })

      return result.type === 'json' ? result.body : null
    } catch (e) {
      this.processErrors(e)
    }

    return null
  }

  /**
   * Selecciona un entorno para la ejecución actual sin modificar el entorno activo guardado.
   *
   * @param alias Alias del entorno a utilizar
   */
  public useEnvironment(alias?: string): void {
    if (typeof alias !== 'string') {
      return
    }

    const environment = this.directusEnv.getByAlias(alias)

    if (environment === null) {
      throw new DirectusApiError(`No se encontró un entorno de Directus con el alias '${alias}'.`)
    }

    this.directusEnvData = environment
  }
}
