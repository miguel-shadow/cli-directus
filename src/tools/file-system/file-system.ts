/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import fsImport from 'node:fs'
import fsPromiseImport from 'node:fs/promises'
import pathImport from 'node:path'

import type {
  GetFilesOptions,
  RenameOptions,
  SafeNameOptions,
  WriteFileOptions,
  WriteJsonOptions,
} from './types.js'


/**
 * Contiene utilidades relacionadas con escritura, lectura y eliminación de archivos
 */
export const FileSystemTools = {
  clearDir,
  getFiles,
  getFilesSync,
  readFile,
  readFileSync,
  readFileSafe,
  readFileSafeSync,
  readJson,
  readJsonSync,
  readJsonSafe,
  readJsonSafeSync,
  rename,
  renameSync,
  safeName,
  writeFile,
  writeFileSync,
  writeJson,
  writeJsonSync,
}

/**
 * Error personalizado de FileSystemTools
 */
export class FileSystemToolsError extends Error {}


// Opciones por defecto
const DEFAULT_GET_FILES_OPTIONS: Required<GetFilesOptions> = {
  recursive: false,
}

const DEFAULT_RENAME_OPTIONS: Required<RenameOptions> = {
  override: true,
  silentError: false,
}

const DEFAULT_SAFE_NAME_OPTIONS: Required<SafeNameOptions> = {
  allowedChars: '',
  defaultName: '_',
  maxLength: 250,
  replaceDiacritics: false,
  replaceSpaces: false,
}

const DEFAULT_WRITE_FILE_OPTIONS: Required<WriteFileOptions> = {
  append: false,
  override: true,
  silentError: false,
}

const DEFAULT_WRITE_JSON_OPTIONS: Required<WriteJsonOptions> = {
  override: true,
  pretty: true,
  silentError: false,
}


/**
 * **Elimina** todos los archivos y carpetas del directorio.
 * Si el *path* introducido no existe o no es un directorio, no se realiza ninguna acción.
 *
 * @param dirPath Ruta del directorio a vaciar.
 *
 * @example
 * await FileSystemTools.clearDir('directory-path')
 */
async function clearDir(dirPath: string): Promise<void> {
  try {
    const stats = await fsPromiseImport.stat(dirPath)
    if (!stats.isDirectory()) {
      return
    }

    const files = await getFiles(dirPath)

    const deletePromises = files.map(async (file) => fsPromiseImport.rm(pathImport.join(file.parentPath, file.name), {
      recursive: true,
      force: true,
    }))

    await Promise.all(deletePromises)
  } catch (error) {
    if (error instanceof Error) {
      // Path no existe
      if (
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        return
      }

      throw new FileSystemToolsError(`Se ha producido un error al eliminar el contenido del directorio ${dirPath}: ${error.message}`)
    }

    throw new FileSystemToolsError(typeof error === 'object' ? JSON.stringify(error) : String(error))
  }
}


/**
 * Recupera los archivos y carpetas de un directorio.
 *
 * @param path Path de la carpeta.
 * @param options Opciones de obtención:
 *
 * `recursive` *{boolean}* - Defaults `false`:
 * - `true`: Recupera archivos y carpetas incluyendo el contenido de carpetas hijas.
 * - `false`: Excluye el contenido de carpetas hijas.
 *
 * @returns Archivos y carpetas.
 *
 * @example
 * const files = await FileSystemTools.getFiles('directory-path')
 * @example
 * const files = await FileSystemTools.getFiles('directory-path', { recursive: true })
 */
async function getFiles(path: string, options: GetFilesOptions = {}): Promise<fsImport.Dirent[]> {
  const opts: Required<GetFilesOptions> = {
    ...DEFAULT_GET_FILES_OPTIONS,
    ...options,
  }

  return await fsPromiseImport.readdir(path, { withFileTypes: true, recursive: opts.recursive, encoding: 'utf-8' })
}


/**
 * Recupera los archivos y carpetas de un directorio síncronamente.
 *
 * @param path Path de la carpeta.
 * @param options Opciones de obtención:
 *
 * `recursive` *{boolean}* - Defaults `false`:
 * - `true`: Recupera archivos y carpetas incluyendo el contenido de carpetas hijas.
 * - `false`: Excluye el contenido de carpetas hijas.
 *
 * @returns Archivos y carpetas.
 *
 * @example
 * const files = FileSystemTools.getFilesSync('directory-path')
 * @example
 * const files = FileSystemTools.getFilesSync('directory-path', { recursive: true })
 */
function getFilesSync(path: string, options: GetFilesOptions = {}): fsImport.Dirent[] {
  const opts: Required<GetFilesOptions> = {
    ...DEFAULT_GET_FILES_OPTIONS,
    ...options,
  }

  return fsImport.readdirSync(path, { withFileTypes: true, recursive: opts.recursive, encoding: 'utf-8' })
}


/**
 * Lee un archivo y retorna el contenido.
 *
 * @param filePath Ruta del archivo.
 *
 * @returns Contenido del archivo.
 *
 * @example
 * const content = await FileSystemTools.readFile('file.txt')
 */
async function readFile(filePath: string): Promise<string> {
  return await fsPromiseImport.readFile(filePath, 'utf8')
}


/**
 * Lee un archivo síncronamente y retorna el contenido.
 *
 * @param filePath Ruta del archivo.
 *
 * @returns Contenido del archivo.
 *
 * @example
 * const content = FileSystemTools.readFileSync('file.txt')
 */
function readFileSync(filePath: string): string {
  return fsImport.readFileSync(filePath, 'utf8')
}


/**
 * Lee un archivo y retorna el contenido. Si se produce un error durante la lectura retorna `null`.
 *
 * @param filePath Ruta del archivo.
 *
 * @returns Contenido del archivo.
 *
 * @example
 * const content = await FileSystemTools.readFile('file.txt')
 */
async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath)
  } catch {
    return null
  }
}


/**
 * Lee un archivo síncronamente y retorna el contenido. Si se produce un error durante la lectura retorna `null`.
 *
 * @param filePath Ruta del archivo.
 *
 * @returns Contenido del archivo.
 *
 * @example
 * const content = FileSystemTools.readFileSync('file.txt')
 */
function readFileSafeSync(filePath: string): string | null {
  try {
    return readFileSync(filePath)
  } catch {
    return null
  }
}


/**
 * Lee un archivo con **formato JSON** y retorna la data. Se puede especificar el tipo de retorno o tratarlo como `unknown`.
 *
 * @template T El tipo de dato esperado en el JSON. Defaults `unknown`.
 *
 * @param filePath Ruta del archivo JSON.
 *
 * @returns Contenido parseado del archivo.
 *
 * @example
 * const result = await FileSystemTools.readJson<Type>('file.json') // result: Type
 * @example
 * const result = await FileSystemTools.readJson('file.json') // result: unknown
 */
async function readJson<T = unknown>(filePath: string): Promise<T> {
  try {
    const fileContent = await readFile(filePath)

    return JSON.parse(fileContent) as T
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new FileSystemToolsError(`Error leyendo JSON '${filePath}', no tiene una estructura válida`, { cause: error })
    }

    throw new FileSystemToolsError(`Error leyendo JSON '${filePath}'`, { cause: error })
  }
}


/**
 * Lee un archivo síncronamente con **formato JSON** y retorna la data. Se puede especificar el tipo de retorno o tratarlo como `unknown`.
 *
 * @template T El tipo de dato esperado en el JSON. Defaults `unknown`.
 *
 * @param filePath Ruta del archivo JSON.
 *
 * @returns Contenido parseado del archivo.
 *
 * @example
 * const result = FileSystemTools.readJsonSync<Type>('file.json') // result: Type
 * @example
 * const result = FileSystemTools.readJsonSync('file.json') // result: unknown
 */
function readJsonSync<T = unknown>(filePath: string): T {
  try {
    const raw = readFileSync(filePath)

    return JSON.parse(raw) as T
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new FileSystemToolsError(`Error leyendo JSON '${filePath}', no tiene una estructura válida`, { cause: error })
    }

    throw new FileSystemToolsError(`Error leyendo JSON '${filePath}'`, { cause: error })
  }
}


/**
 * Lee un archivo con **formato JSON** sin lanzar errores, retornando `null`.
 * Se puede especificar el tipo de retorno o tratarlo como `unknown`.
 *
 * @param filePath Ruta del archivo JSON.
 *
 * @returns La data contenida o `null` si ocurre algún error.
 *
 * @example
 * const result = await readJsonSafe<Type>('file.json') // result: Type
 * @example
 * const result = await readJsonSafe('file.json') // result: unknown
 * @example
 * const result = await readJsonSafe('notValid.json') // result = null
 */
async function readJsonSafe<T = unknown>(filePath: string): Promise<T | null> {
  try {
    return await readJson(filePath)
  } catch {
    return null
  }
}


/**
 * Lee un archivo síncronamente con **formato JSON** sin lanzar errores, retornando `null`.
 * Se puede especificar el tipo de retorno o tratarlo como `unknown`.
 *
 * @param filePath Ruta del archivo JSON.
 *
 * @returns La data contenida o `null` si ocurre algún error.
 *
 * @example
 * const result = readJsonSafeSync<Type>('file.json') // result: Type
 * @example
 * const result = readJsonSafeSync('file.json') // result: unknown
 * @example
 * const result = readJsonSafeSync('notValid.json') // result = null
 */
function readJsonSafeSync<T = unknown>(filePath: string): T | null {
  try {
    return readJsonSync<T>(filePath)
  } catch {
    return null
  }
}


/**
 * Renombra un archivo o carpeta.
 *
 * @param oldPath Path del archivo/carpeta a renombrar.
 * @param newPath Nuevo path.
 * @param options Opciones de renombrado:
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino si existe.
 * - `false`: No sobrescribe el archivo de destino si existe, lanzando un error.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza un error.
 *
 * @return `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`
 *
 * @example
 * await FileSystemTools.rename('test', 'testRenamed')
 * @example
 * await FileSystemTools.rename('test', 'testRenamed', { override: false })
 * @example
 * await FileSystemTools.rename('test', 'testRenamed', { silentError: true })
 * @example
 * const success = await FileSystemTools.rename('test', 'testRenamed', { override: false, silentError: true })
 */
async function rename(oldPath: string, newPath: string, options: RenameOptions = {}): Promise<boolean> {
  const opts = {
    ...DEFAULT_RENAME_OPTIONS,
    ...options,
  }

  try {
    if (!opts.override) {
      if (fsImport.existsSync(newPath)) {
        throw new FileSystemToolsError(`El archivo '${newPath}' ya existe. Usa la opción {override: true} para sobrescribir.`)
      }
    }

    const dirPath = pathImport.resolve(newPath, '../')
    await fsPromiseImport.mkdir(dirPath, { recursive: true })

    await fsPromiseImport.rename(oldPath, newPath)
    return true
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error renombrando en '${newPath}'`, { cause: error })
  }
}


/**
 * Renombra un archivo o carpeta síncronamente
 *
 * @param oldPath Path del archivo/carpeta a renombrar.
 * @param newPath Nuevo path.
 * @param options Opciones de renombrado:
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino si existe.
 * - `false`: No sobrescribe el archivo de destino si existe, lanzando un error.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza un error.
 *
 * @return `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`
 *
 * @example
 * FileSystemTools.renameSync('test', 'testRenamed')
 * @example
 * FileSystemTools.renameSync('test', 'testRenamed', { override: false })
 * @example
 * FileSystemTools.renameSync('test', 'testRenamed', { silentError: true })
 * @example
 * const success = FileSystemTools.renameSync('test', 'testRenamed', { override: false, silentError: true })
 */
function renameSync(oldPath: string, newPath: string, options: RenameOptions = {}): boolean {
  const opts = {
    ...DEFAULT_RENAME_OPTIONS,
    ...options,
  }

  try {
    if (!opts.override) {
      if (fsImport.existsSync(newPath)) {
        throw new FileSystemToolsError(`El archivo '${newPath}' ya existe. Usa la opción {override: true} para sobrescribir.`)
      }
    }

    const dirPath = pathImport.resolve(newPath, '../')
    fsImport.mkdirSync(dirPath, { recursive: true })

    fsImport.renameSync(oldPath, newPath)
    return true
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error renombrando en '${newPath}'`, { cause: error })
  }
}


/**
 * Genera un nombre seguro para archivos o carpetas.
 *
 * Flujo de transformación:
 * 1. Normaliza espacios, eliminando espacios al inicio/final y espacios seguidos.
 * 2. Convierte diacríticos (si se especifica). Defaults `false`.
 * 3. Reemplaza caracteres no permitidos según `allowedChars` por `_`. Por defecto se aceptan todos los caracteres.
 * 4. Convierte espacios en `_` (si se especifica). Defaults `false`.
 * 5. Se trunca el nombre resultante si supera la longitud máxima permitida.
 * 6. Reemplaza caracteres no permitidos en Windows por `_`.
 * 7. Elimina la terminación en `.` o espacio, ya que no son válidos en Windows.
 * 8. Evita nombres reservados de Windows añadiendo `_` al principio.
 *
 * @param name Nombre del archivo o carpeta a formatear.
 * @param options Opciones de nombre seguro:
 *
 * `allowedChars` *{string | SafeNameOptionsAllowedCharsObject}* - Regex de **caracteres permitidos**.
 * Los caracteres no permitidos se sustituirán por `'_'`. Defaults `''` (se permiten todos):
 * - `string` con los caracteres permitidos, por ejemplo: `'a-zA-Z0-9_\\s'`.
 * - `SafeNameOptionsAllowedCharsObject` con los caracteres permitidos y las flags:
 * 1. `regex`: Cadena con la regex de los caracteres permitidos. Por ejemplo: `'\\p{Letter}\\p{Number}_\\s'`.
 * 1. `flags`: Flags de la regex adicionales. Por ejemplo: `'u'`.
 *
 * *Importante escapar la `\` mediante `\\` al ser una string que se convertirá en una regex.
 *
 * `defaultName` *{string}* - Valor por defecto a usar si el nombre resultante es una cadena vacía después de aplicar las transformaciones.
 * Defaults: `'_'`.
 *
 * `maxLength` *{number}* - Longitud máxima permitida para el nombre resultante. Si el nombre supera esta longitud, se truncará.
 * Si el valor es inferior a 1, no se realiza el truncado. Defaults: `255`.
 *
 * `replaceDiacritics` *{boolean}* - Defaults `false`:
 * - `true`: Reemplaza los caracteres diacríticos (tildes, acentos...). Por ejemplo `'Café' => 'Cafe'`.
 * - `false`: No se reemplazan.
 *
 * `replaceSpaces` *{boolean}* - Defaults `false`:
 * - `true`: Reemplaza los espacios por guiones bajos. Por ejemplo `'Hello World' => 'Hello_World'`.
 * - `false`: No se reemplazan.
 *
 * @returns Nombre transformado.
 *
 * @example
 * const safeName = FileSystemTools.safeName('  mi   ?archivo  ')
 * // 'mi _archivo'
 * @example
 * // Permitir solo letras, números, guiones bajos y espacios
 * const safeName = FileSystemTools.safeName('archivo@invalido#2024', { allowedChars: 'a-zA-Z0-9_\\s' })
 * // 'archivo_invalido_2024'
 * @example
 * // Permitir caracteres Unicode de cualquier idioma, números, guiones bajos y espacios
 * const safeName = FileSystemTools.safeName('文件 café №1', {
 *   allowedChars: {
 *     allow: '\\p{Letter}\\p{Number}_\\s',
 *     flags: 'u'
 *   }
 * })
 * // '文件 café _1'
 * @example
 * // Permitir solo letras minúsculas, números y guiones bajos
 * const safeName = FileSystemTools.safeName('Mi-Archivo_2024!', { allowedChars: 'a-z0-9_' })
 * // '_i__rchivo_2024_'
 * @example
 * const safeName = FileSystemTools.safeName('     ', { defaultName: 'customDefaultName' })
 * // 'customDefaultName'
 * @example
 * const safeName = FileSystemTools.safeName('nombre de archivo largo.txt', { maxLength: 12 })
 * // 'nombre de ar'
 * @example
 * const safeName = FileSystemTools.safeName('Café con leche y azúcar', { replaceDiacritics: true })
 * // 'Cafe con leche y azucar'
 * @example
 * const safeName = FileSystemTools.safeName('Hola Mundo', { replaceSpaces: true })
 * // 'Hola_Mundo'
 */
function safeName(name: string, options: SafeNameOptions = {}): string {
  const DEFAULT_REPLACE_CHAR = '_'
  const WINDOWS_INVALID_CHARS = /[<>:"/\\|?*]/g
  const WINDOWS_FILENAMES_RESERVED = new Set([
    'con',
    'prn',
    'aux',
    'nul',
    'com1',
    'com2',
    'com3',
    'com4',
    'com5',
    'com6',
    'com7',
    'com8',
    'com9',
    'lpt1',
    'lpt2',
    'lpt3',
    'lpt4',
    'lpt5',
    'lpt6',
    'lpt7',
    'lpt8',
    'lpt9',
  ])

  // Opciones por defecto
  const opts: Required<SafeNameOptions> = {
    ...DEFAULT_SAFE_NAME_OPTIONS,
    ...options,
  }

  // Limpieza básica
  let result = name.trim().replace(/\s+/g, ' ')

  // Diacríticos
  if (opts.replaceDiacritics) {
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  // Caracteres permitidos
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (opts.allowedChars) {
    let regex: string
    let flags = 'g'

    if (typeof opts.allowedChars === 'string') {
      regex = opts.allowedChars
    } else {
      regex = opts.allowedChars.allow
      flags += opts.allowedChars.flags
    }

    const notAllowedRegex = new RegExp(`[^${regex}]`, flags)
    result = result.replace(notAllowedRegex, DEFAULT_REPLACE_CHAR)
  }

  // Espacios
  if (opts.replaceSpaces) {
    result = result.replace(/\s/g, DEFAULT_REPLACE_CHAR)
  }

  // Comprobar longitud
  if (opts.maxLength > 0 && result.length > opts.maxLength) {
    result = result.slice(0, opts.maxLength)
  }

  // Eliminar caracteres inválidos de Windows
  result = result.replace(WINDOWS_INVALID_CHARS, DEFAULT_REPLACE_CHAR)

  // Evitar terminación en . o espacio
  result = result.replace(/[ .]+$/, '')

  // Nombre reservados de Windows
  if (WINDOWS_FILENAMES_RESERVED.has(result)) {
    result = `${DEFAULT_REPLACE_CHAR}${result}`
  }

  return result || opts.defaultName
}


/**
 * Escribe un texto en un archivo.
 *
 * @param filePath Ruta del archivo JSON.
 * @param text Texto a escribir.
 * @param options Opciones de escritura:
 *
 * `append` *{boolean}* - Defaults `false`:
 * - `true`: Agrega el contenido al archivo existente.
 * - `false`: Sobrescribe el archivo si existe.
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino.
 * - `false`: Lanza un error si el archivo de destino existe.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza el error producido.
 *
 * @returns `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`.
 *
 * @example
 * await FileSystemTools.writeFile('file.txt', 'Contenido a escribir')
 * @example
 * await FileSystemTools.writeFile('file.txt', 'Texto adicional', { append: true })
 * @example
 * await FileSystemTools.writeFile('file.txt', 'Texto adicional', { append: true, override: false })
 * // No hay diferencia con `override: true`
 * @example
 * await FileSystemTools.writeFile('file.txt', 'Contenido', { override: false })
 * @example
 * const success = await FileSystemTools.writeFile('file.txt', 'Contenido', { override: false, silentError: true })
 */
async function writeFile(filePath: string, text: string, options: WriteFileOptions = {}): Promise<boolean> {
  const opts: Required<WriteFileOptions> = {
    ...DEFAULT_WRITE_FILE_OPTIONS,
    ...options,
  }

  try {
    // Validar si el archivo existe cuando no es append y override es false
    if (!opts.append && !opts.override) {
      if (fsImport.existsSync(filePath)) {
        throw new FileSystemToolsError(`El archivo '${filePath}' ya existe. Usa la opción {override: true} para sobrescribir.`)
      }
    }

    const dirPath = pathImport.resolve(filePath, '../')
    await fsPromiseImport.mkdir(dirPath, { recursive: true })

    if (opts.append) {
      await fsPromiseImport.appendFile(filePath, text, { encoding: 'utf8' })
      return true
    }

    await fsPromiseImport.writeFile(filePath, text, { encoding: 'utf8' })
    return true
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error escribiendo en '${filePath}'`, { cause: error })
  }
}


/**
 * Escribe síncronamente un texto en un archivo.
 *
 * @param filePath Ruta del archivo JSON.
 * @param text Texto a escribir.
 * @param options Opciones de escritura:
 *
 * `append` *{boolean}* - Defaults `false`:
 * - `true`: Agrega el contenido al archivo existente.
 * - `false`: Sobrescribe el archivo si existe.
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino.
 * - `false`: Lanza un error si el archivo de destino existe.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza el error producido.
 *
 * @returns `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`.
 *
 * @example
 * FileSystemTools.writeFileSync('file.txt', 'Contenido a escribir')
 * @example
 * FileSystemTools.writeFileSync('file.txt', 'Texto adicional', { append: true })
 * @example
 * FileSystemTools.writeFileSync('file.txt', 'Texto adicional', { append: true, override: false })
 * // No hay diferencia con `override: true`
 * @example
 * FileSystemTools.writeFileSync('file.txt', 'Contenido', { override: false })
 * @example
 * const success = FileSystemTools.writeFileSync('file.txt', 'Contenido', { override: false, silentError: true })
 */
function writeFileSync(filePath: string, text: string, options: WriteFileOptions = {}): boolean {
  const opts: Required<WriteFileOptions> = {
    ...DEFAULT_WRITE_FILE_OPTIONS,
    ...options,
  }

  try {
    // Validar si el archivo existe cuando no es append y override es false
    if (!opts.append && !opts.override) {
      if (fsImport.existsSync(filePath)) {
        throw new FileSystemToolsError(`El archivo '${filePath}' ya existe. Usa la opción {override: true} para sobrescribir.`)
      }
    }

    const dirPath = pathImport.resolve(filePath, '../')
    fsImport.mkdirSync(dirPath, { recursive: true })

    if (opts.append) {
      fsImport.appendFileSync(filePath, text, { encoding: 'utf8' })
      return true
    }

    fsImport.writeFileSync(filePath, text, { encoding: 'utf8' })
    return true
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error escribiendo en '${filePath}'`, { cause: error })
  }
}


/**
 * Escribe data en un archivo con **formato JSON**.
 *
 * @param filePath Ruta del archivo JSON.
 * @param data Datos a escribir.
 * @param options Opciones de escritura:
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino.
 * - `false`: Lanza un error si el archivo de destino existe.
 *
 * `pretty` *{boolean}* - Defaults `true`:
 * - `true`: JSON con saltos de línea e indentación.
 * - `false`: JSON de una sola línea.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza el error producido.
 *
 * @returns `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`.
 *
 * @example
 * await FileSystemTools.writeJson('file.json', { key: 'value' })
 * @example
 * await FileSystemTools.writeJson('file.json', { key: 'value' }, { pretty: false })
 * @example
 * await FileSystemTools.writeJson('file.json', { key: 'value' }, { override: false })
 * @example
 * const success = await FileSystemTools.writeJson('file.json', { key: 'value' }, { silentError: true })
 */
async function writeJson(filePath: string, data: unknown, options: WriteJsonOptions = {}): Promise<boolean> {
  const opts: Required<WriteJsonOptions> = {
    ...DEFAULT_WRITE_JSON_OPTIONS,
    ...options,
  }

  try {
    const json = opts.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)

    return await writeFile(filePath, json, { append: false, override: opts.override, silentError: opts.silentError })
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error escribiendo JSON '${filePath}'`, { cause: error })
  }
}


/**
 * Escribe síncronamente data en un archivo con **formato JSON**.
 *
 * @param filePath Ruta del archivo JSON.
 * @param data Datos a escribir.
 * @param options Opciones de escritura:
 *
 * `override` *{boolean}* - Defaults `true`:
 * - `true`: Sobrescribe el archivo de destino.
 * - `false`: Lanza un error si el archivo de destino existe.
 *
 * `pretty` *{boolean}* - Defaults `true`:
 * - `true`: JSON con saltos de línea e indentación.
 * - `false`: JSON de una sola línea.
 *
 * `silentError` *{boolean}* - Defaults `false`:
 * - `true`: Error silencioso, retornando `false`.
 * - `false`: Lanza el error producido.
 *
 * @returns `true` si la operación se realiza exitosamente y `false` en caso de error con `options.silentError = true`.
 *
 * @example
 * FileSystemTools.writeJsonSync('file.json', { key: 'value' })
 * @example
 * FileSystemTools.writeJsonSync('file.json', { key: 'value' }, { pretty: false })
 * @example
 * FileSystemTools.writeJsonSync('file.json', { key: 'value' }, { override: false })
 * @example
 * const success = FileSystemTools.writeJsonSync('file.json', { key: 'value' }, { silentError: true })
 */
function writeJsonSync(filePath: string, data: unknown, options: WriteJsonOptions = {}): boolean {
  const opts: Required<WriteJsonOptions> = {
    ...DEFAULT_WRITE_JSON_OPTIONS,
    ...options,
  }

  try {
    const json = opts.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)

    return writeFileSync(filePath, json, { append: false, override: opts.override, silentError: opts.silentError })
  } catch (error) {
    if (opts.silentError) {
      return false
    }

    if (error instanceof FileSystemToolsError) {
      throw error
    }

    throw new FileSystemToolsError(`Error escribiendo JSON '${filePath}'`, { cause: error })
  }
}
