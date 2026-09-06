import type { z } from 'zod'
import type { GetErrorMessagesOptions } from './types.js'


enum MESSAGES {
  DEFAULT_VALUE = '<default_value>',
  HAS_DEFAULT_VALUE = 'Tiene el valor por defecto \'{0}\'',
  INTEGER_TYPE = 'El valor debe ser de tipo \'integer\'',
  NUMBER_TYPE = 'El valor debe ser de tipo \'number\'',
  STRING_TYPE = 'El valor debe ser de tipo \'string\'',
  URL_TYPE = 'El valor debe ser una URL válida',
  VALUE_REQUIRED = 'Debe tener un valor',
}


/**
 * Herramientas de *Zod*
 */
export const ZodTools = {
  MESSAGES,
  getErrorMessages,
}


// Opciones por defecto
const DEFAULT_GET_ERROR_MESSAGES_OPTIONS: Required<GetErrorMessagesOptions> = {
  includePath: true,
  includeUnrecognizedKeys: false,
  pathColor: null,
  textColor: null,
}


/**
 * Formatea los **errores** de **parseo** de *Zod*.
 * Mensaje de error: `path.to.field: error message`.
 *
 * @param error Error de parseo de Zod.
 * @param options Opciones de formato:
 *
 * `includePath` *{boolean}* - Defaults `true`:
 * - `true`: Incluye el path del error con formato `path.to.field`.
 * - `false`: No incluye el path.
 *
 * `includeUnrecognizedKeys` *{boolean}* - Defaults `false`:
 * - `true`: Incluye los errores de claves desconocidas encontradas en el objeto.
 * - `false`: Se excluyen los errores de claves desconocidas.
 *
 * `pathColor` *{ChalkInstance | null}* - Color del path. Por ejemplo `chalk.red`. Defaults `null`.
 *
 * `textColor` *{ChalkInstance | null}* - Color del texto. Por ejemplo `chalk.red`. Defaults `null`.
 *
 * @returns Array con los errores
 *
 * @example
 * const schema = z.object({
 *   key: z.object({
 *     subkey: z.string(),
 *   }),
 * })
 * const result = schema.safeParse({ key: {} }))
 *
 * ZodTools.getErrorMessages(result.error)
 * // [ 'key.subkey: Invalid input: expected string, received undefined' ]
 *
 * @example
 * const schema = z.object({
 *   key: z.object({
 *     subkey: z.string(),
 *   }),
 * })
 * const result = schema.safeParse({ key: {} })
 *
 * ZodTools.getErrorMessages(result.error, {
 *   includePath: false,
 *   pathColor: chalk.red,
 *   textColor: chalk.blueBright,
 * })
 * // [ 'Invalid input: expected string, received undefined' ]
 *
 * @example
 * const schema = z.object({
 *   key: z.object({
 *     subkey: z.string(),
 *   }),
 * }).strict()
 * const result = schema.safeParse({ unknown: '', unknown2: '', key: { subkey: '-' } })
 *
 * ZodTools.getErrorMessages(result.error, {
 *   includeUnrecognizedKeys: true,
 * })
 * // [ "Claves desconocidas: 'unknown', 'unknown2'" ]
 */
function getErrorMessages(error: z.ZodError, options: GetErrorMessagesOptions = {}): string[] {
  const opts = {
    ...DEFAULT_GET_ERROR_MESSAGES_OPTIONS,
    ...options,
  }

  const messages: string[] = []

  error.issues.forEach((e) => {
    if (!opts.includeUnrecognizedKeys && e.code === 'unrecognized_keys') {
      return
    }

    if (e.code === 'unrecognized_keys') {
      messages.push(e.message
        .replace('Unrecognized keys', 'Claves desconocidas')
        .replaceAll('"', '\''))
      return
    }

    let message = ''
    if (opts.includePath) {
      message += opts.pathColor ? opts.pathColor(e.path.join('.')) : `${e.path.join('.')}: `
    }

    message += e.message
    messages.push(message)
  })

  return messages
}
