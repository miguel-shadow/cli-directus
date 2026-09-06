import { join } from 'node:path'
import { FileSystemTools } from '@tools'
import {
  directusEnvDataArraySchema,
  directusEnvDataSchema,
  type DirectusEnvData,
} from './schemas.js'
import type { EnvConfig } from '@env'


export class DirectusEnv {
  private env: EnvConfig


  constructor(env: EnvConfig) {
    this.env = env
  }


  /**
   * Retorna el path del archivo que contiene el alias del entorno actual
   *
   * @returns path del archivo
   */
  private getCurrentEnvPath(): string {
    return join(this.env.paths.cwd, '.directus-env')
  }

  /**
   * Retorna el path del archivo que contiene los entornos
   *
   * @returns path del archivo
   */
  private getDataFilePath(): string {
    return join(this.env.paths.user, 'envs.json')
  }


  /**
   * Añade un nuevo entorno al archivo de entornos.
   * Si ya existe un entorno con el mismo alias, lanza un error.
   *
   * @param data data del entorno a añadir
   */
  public add(data: DirectusEnvData): DirectusEnvData {
    const result = directusEnvDataSchema.safeParse(data)

    if (!result.success) {
      throw result.error
    }

    const existingData = this.getAll()

    if (existingData.some((item) => item.alias === result.data.alias)) {
      throw new Error(`Ya existe un entorno con el alias '${result.data.alias}'. Utilice un alias diferente.`)
    }

    existingData.push(result.data)
    FileSystemTools.writeJsonSync(this.getDataFilePath(), existingData)

    return result.data
  }


  /**
   * Recupera los entornos almacenados en el archivo de entornos. Si el archivo no existe, retorna un arary vacío.
   *
   * @returns Entornos almacenados
   */
  public getAll(): DirectusEnvData[] {
    const result = directusEnvDataArraySchema.safeParse(FileSystemTools.readJsonSafeSync(this.getDataFilePath()) ?? [])

    if (!result.success) {
      throw result.error
    }

    return result.data
  }


  /**
   * Retorna la data de un entorno mediante su alias. Si no existe, retorna null.
   *
   * @param alias Alias del entorno a recuperar
   * @returns Data del entorno o null si no existe
   */
  public getByAlias(alias: string): DirectusEnvData | null {
    const allData = this.getAll()

    const data = allData.find((item) => item.alias === alias)

    if (!data) {
      return null
    }

    return data
  }


  /**
   * Retorna el entorno actual almacenado.
   *
   * @returns Data del entorno actual
   */
  public getCurrent(): DirectusEnvData | null {
    const alias = FileSystemTools.readFileSafeSync(this.getCurrentEnvPath())

    if (typeof alias !== 'string') {
      return null
    }

    return this.getByAlias(alias)
  }


  /**
   * Elimina un entorno del archivo de entornos mediante su alias.
   *
   * @param alias Alias del entorno a eliminar
   */
  public remove(alias: string): void {
    const toDelete = this.getByAlias(alias)

    if (toDelete === null) {
      throw new Error(`No se encontró un entorno con el alias '${alias}'.`)
    }

    const existingData = this.getAll()
    const updatedData = existingData.filter((item) => item.alias !== alias)

    FileSystemTools.writeJsonSync(this.getDataFilePath(), updatedData)
  }


  /**
   * Establece el entorno actual.
   *
   * @param alias Alias del entorno a establecer
   * @returns Data del entorno establecido
   */
  public setCurrent(alias: string): DirectusEnvData {
    const data = this.getByAlias(alias)

    if (data === null) {
      throw new Error(`No se encontró un entorno con el alias '${alias}'.`)
    }

    FileSystemTools.writeFileSync(this.getCurrentEnvPath(), alias)

    return data
  }
}
